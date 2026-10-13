-- Conexão Positiva — pedidos e pagamentos do Método C.E.N.T.R.O.
--
-- Princípios (os mesmos de 20261011000000_formularios.sql):
-- * Só o servidor do site escreve e lê (chave secreta / service_role). RLS ativo e SEM
--   políticas: as chaves públicas (anon / authenticated) não têm qualquer acesso.
-- * O valor de cada pedido vem do catálogo no servidor, nunca do browser.
-- * O link da página de pagamento leva um código aleatório; aqui guarda-se só o seu hash.
-- * Pagamento confirmado numa função atómica e idempotente (avisos repetidos não duplicam).
-- * Conservação: os pedidos pagos servem de suporte contabilístico; não são apagados
--   automaticamente. Pedidos não pagos são apagados 12 meses depois (purge_expired_orders).

create table public.orders (
  id                 uuid primary key,
  created_at         timestamptz not null default now(),
  offer_id           text not null check (offer_id ~ '^[a-z0-9-]{1,80}$'),
  offer_name         text not null check (char_length(offer_name) between 1 and 200),
  amount_kz          integer not null check (amount_kz between 0 and 100000000),
  name               text not null check (char_length(name) between 1 and 120),
  email              text not null check (char_length(email) between 3 and 254),
  phone              text not null check (char_length(phone) between 9 and 20),
  consent_at         timestamptz not null,
  access_token_hash  text not null check (access_token_hash ~ '^[0-9a-f]{64}$'),
  status             text not null default 'pendente'
                       check (status in ('pendente', 'pago', 'expirado', 'cancelado')),
  provider           text not null check (char_length(provider) between 1 and 40),
  provider_ref       text not null default '' check (char_length(provider_ref) <= 120),
  -- Instruções mostradas na página de pagamento (entidade/referência ou link do fornecedor).
  instructions       jsonb check (instructions is null or pg_column_size(instructions) <= 4096),
  paid_at            timestamptz,
  check (status <> 'pago' or paid_at is not null)
);
comment on table public.orders is 'Pedidos de compra do Método C.E.N.T.R.O. (bilhetes, e-books, guia).';

-- Uma referência do fornecedor corresponde a um único pedido.
create unique index orders_provider_ref
  on public.orders (provider, provider_ref)
  where provider_ref <> '';
create index orders_by_status on public.orders (status, created_at desc);

alter table public.orders enable row level security;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on public.orders from anon, authenticated';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Confirmação de pagamento: só muda o pedido se o fornecedor, a referência e o valor
-- coincidirem. Devolve 'pago' (agora), 'ja-pago' (aviso repetido) ou 'rejeitado'.
-- ---------------------------------------------------------------------------
create function public.mark_order_paid(
  p_order_id      uuid,
  p_provider      text,
  p_provider_ref  text,
  p_amount_kz     integer
)
returns table (result text)
language plpgsql
set search_path = public
as $$
begin
  update public.orders
     set status = 'pago', paid_at = now()
   where id = p_order_id
     and provider = p_provider
     and provider_ref = p_provider_ref
     and amount_kz = p_amount_kz
     and status in ('pendente', 'expirado');

  if found then
    return query select 'pago'::text;
  elsif exists (select 1 from public.orders where id = p_order_id and status = 'pago') then
    return query select 'ja-pago'::text;
  else
    return query select 'rejeitado'::text;
  end if;
end;
$$;

-- Pedidos não pagos com mais de 12 meses. Agendar uma vez por dia, como purge_expired_records.
create function public.purge_expired_orders()
returns void
language sql
set search_path = public
as $$
  update public.orders set status = 'expirado'
   where status = 'pendente'
     and (instructions ->> 'expiresAt')::timestamptz < now();
  delete from public.orders
   where status in ('pendente', 'expirado', 'cancelado')
     and created_at < now() - interval '12 months';
$$;

revoke execute on function public.mark_order_paid(uuid, text, text, integer) from public;
revoke execute on function public.purge_expired_orders() from public;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant execute on function public.mark_order_paid(uuid, text, text, integer) to service_role';
    execute 'grant execute on function public.purge_expired_orders() to service_role';
    execute 'revoke execute on function public.mark_order_paid(uuid, text, text, integer) from anon, authenticated';
    execute 'revoke execute on function public.purge_expired_orders() from anon, authenticated';
  end if;
end $$;

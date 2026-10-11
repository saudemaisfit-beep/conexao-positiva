-- Conexão Positiva — dados dos formulários (Fase 14)
--
-- Princípios:
-- * Só o servidor do site escreve e lê (chave secreta / service_role). RLS ativo e SEM
--   políticas: as chaves públicas (anon / authenticated) não têm qualquer acesso.
-- * Limites de tamanho e listas de valores também na base de dados (defesa em profundidade).
-- * Inscrições numa função atómica: nunca são atribuídas mais vagas do que a lotação.
-- * Conservação (decisão D6): leads 24 meses; inscrições 12 meses após o evento.

-- ---------------------------------------------------------------------------
-- Mensagens de contacto
-- ---------------------------------------------------------------------------
create table public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 120),
  company     text not null default '' check (char_length(company) <= 120),
  email       text not null check (char_length(email) between 3 and 254),
  phone       text not null default '' check (char_length(phone) <= 20),
  subject     text not null check (subject in ('informacao', 'parcerias', 'imprensa', 'outro')),
  message     text not null check (char_length(message) between 10 and 3000),
  consent_at  timestamptz not null,
  status      text not null default 'novo' check (status in ('novo', 'respondido', 'arquivado'))
);
comment on table public.contact_messages is 'Mensagens do formulário /contactos.';

-- ---------------------------------------------------------------------------
-- Pedidos de proposta
-- ---------------------------------------------------------------------------
create table public.proposal_requests (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  name            text not null check (char_length(name) between 1 and 120),
  company         text not null check (char_length(company) between 1 and 120),
  role            text not null check (char_length(role) between 1 and 120),
  email           text not null check (char_length(email) between 3 and 254),
  phone           text not null check (char_length(phone) between 9 and 20),
  service         text not null check (service in (
                    'palestras', 'formacoes', 'workshops', 'team-building',
                    'desenvolvimento-de-lideranca', 'desenvolvimento-de-equipas',
                    'bem-estar-corporativo', 'eventos-corporativos', 'metodo-centro', 'nao-sei')),
  participants    text not null check (participants in ('ate-20', '21-50', '51-100', '101-250', 'mais-250')),
  location        text not null check (char_length(location) between 1 and 160),
  preferred_date  date,
  date_undecided  boolean not null default false,
  objective       text not null check (char_length(objective) between 10 and 2000),
  budget          text check (budget in ('ate-500k', '500k-1m', '1m-3m', 'mais-3m', 'prefiro-nao-indicar')),
  details         text not null default '' check (char_length(details) <= 3000),
  consent_at      timestamptz not null,
  status          text not null default 'novo' check (status in (
                    'novo', 'em-analise', 'proposta-enviada', 'ganho', 'perdido', 'arquivado')),
  check (date_undecided or preferred_date is not null)
);
comment on table public.proposal_requests is 'Pedidos do formulário /solicitar-proposta.';

-- ---------------------------------------------------------------------------
-- Inscrições em eventos (o evento vive no Sanity; guardamos o slug e uma cópia do nome e da data)
-- ---------------------------------------------------------------------------
create table public.event_registrations (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  event_slug       text not null check (event_slug ~ '^[a-z0-9-]{1,120}$'),
  event_title      text not null check (char_length(event_title) <= 200),
  event_starts_at  timestamptz not null,
  first_name       text not null check (char_length(first_name) between 1 and 80),
  last_name        text not null check (char_length(last_name) between 1 and 80),
  email            text not null check (char_length(email) between 3 and 254),
  phone            text not null check (char_length(phone) between 9 and 20),
  company          text not null default '' check (char_length(company) <= 120),
  role             text not null default '' check (char_length(role) <= 120),
  notes            text not null default '' check (char_length(notes) <= 1000),
  consent_at       timestamptz not null,
  status           text not null check (status in ('confirmada', 'lista-de-espera', 'cancelada'))
);
comment on table public.event_registrations is 'Inscrições e lista de espera dos eventos.';

-- Uma inscrição ativa por pessoa (e-mail) e por evento.
create unique index event_registrations_one_per_person
  on public.event_registrations (event_slug, lower(email))
  where status <> 'cancelada';
create index event_registrations_by_event on public.event_registrations (event_slug, status);

-- ---------------------------------------------------------------------------
-- Segurança: RLS ativo e sem políticas; nenhum acesso para as chaves públicas.
-- ---------------------------------------------------------------------------
alter table public.contact_messages    enable row level security;
alter table public.proposal_requests   enable row level security;
alter table public.event_registrations enable row level security;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on public.contact_messages, public.proposal_requests, public.event_registrations from anon, authenticated';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Inscrição atómica: bloqueia o evento durante a transação, conta as vagas ocupadas e
-- decide entre "confirmada" e "lista-de-espera". Devolve "duplicada" se o e-mail já estiver
-- inscrito. A lotação vem do CMS e é passada pelo servidor (nunca pelo browser).
-- ---------------------------------------------------------------------------
create function public.register_for_event(
  p_event_slug      text,
  p_event_title     text,
  p_event_starts_at timestamptz,
  p_capacity        integer,
  p_first_name      text,
  p_last_name       text,
  p_email           text,
  p_phone           text,
  p_company         text default '',
  p_role            text default '',
  p_notes           text default ''
)
returns table (registration_id uuid, result text)
language plpgsql
set search_path = public
as $$
declare
  v_taken  integer;
  v_status text;
  v_id     uuid;
begin
  perform pg_advisory_xact_lock(hashtext('event:' || p_event_slug));

  if exists (
    select 1 from public.event_registrations
    where event_slug = p_event_slug and lower(email) = lower(p_email) and status <> 'cancelada'
  ) then
    return query select null::uuid, 'duplicada'::text;
    return;
  end if;

  select count(*) into v_taken
  from public.event_registrations
  where event_slug = p_event_slug and status = 'confirmada';

  v_status := case
    when p_capacity is null or v_taken < p_capacity then 'confirmada'
    else 'lista-de-espera'
  end;

  insert into public.event_registrations (
    event_slug, event_title, event_starts_at, first_name, last_name, email, phone,
    company, role, notes, consent_at, status
  ) values (
    p_event_slug, p_event_title, p_event_starts_at, p_first_name, p_last_name, p_email, p_phone,
    coalesce(p_company, ''), coalesce(p_role, ''), coalesce(p_notes, ''), now(), v_status
  )
  returning id into v_id;

  return query select v_id, v_status;
end;
$$;

-- Vagas ocupadas (inscrições confirmadas) por evento.
create function public.event_registration_counts(p_event_slugs text[])
returns table (event_slug text, confirmed integer)
language sql
stable
set search_path = public
as $$
  select r.event_slug, count(*)::integer
  from public.event_registrations r
  where r.event_slug = any (p_event_slugs) and r.status = 'confirmada'
  group by r.event_slug;
$$;

-- Conservação (D6). Agendar uma vez por dia (ex.: pg_cron, ver docs/fase-14/01-base-de-dados.md).
create function public.purge_expired_records()
returns void
language sql
set search_path = public
as $$
  delete from public.contact_messages   where created_at < now() - interval '24 months';
  delete from public.proposal_requests  where created_at < now() - interval '24 months';
  delete from public.event_registrations where event_starts_at < now() - interval '12 months';
$$;

-- As funções só podem ser executadas pelo servidor (service_role).
revoke execute on function public.register_for_event(text, text, timestamptz, integer, text, text, text, text, text, text, text) from public;
revoke execute on function public.event_registration_counts(text[]) from public;
revoke execute on function public.purge_expired_records() from public;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant execute on function public.register_for_event(text, text, timestamptz, integer, text, text, text, text, text, text, text) to service_role';
    execute 'grant execute on function public.event_registration_counts(text[]) to service_role';
    execute 'grant execute on function public.purge_expired_records() to service_role';
    execute 'revoke execute on function public.register_for_event(text, text, timestamptz, integer, text, text, text, text, text, text, text) from anon, authenticated';
    execute 'revoke execute on function public.event_registration_counts(text[]) from anon, authenticated';
    execute 'revoke execute on function public.purge_expired_records() from anon, authenticated';
  end if;
end $$;

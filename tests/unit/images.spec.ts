import { expect, test } from "@playwright/test";
import { getEditorialImage, homeImages, serviceImages } from "../../src/content/provisional-images";

// Evita que uma alteração ao catálogo volte a repetir fotografias nos destaques.
test("as oito soluções têm fotografias diferentes entre si e do cabeçalho", () => {
  const images = [...Object.values(serviceImages), getEditorialImage("/solucoes")!];
  expect(images).toHaveLength(9);
  expect(new Set(images.map((image) => image.src)).size).toBe(images.length);
});

test("as fotografias próprias da Home não se repetem nem reutilizam as dos serviços", () => {
  const images = [
    ...homeImages.slides,
    homeImages.about,
    homeImages.contact,
    ...Object.values(serviceImages),
  ];
  expect(new Set(images.map((image) => image.src)).size).toBe(images.length);
});

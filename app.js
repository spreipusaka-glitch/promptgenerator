const categorySelect = document.getElementById("categorySelect");
const themeSelect = document.getElementById("themeSelect");
const styleSelect = document.getElementById("styleSelect");
const keywordInput = document.getElementById("keywordInput");
const allowLiving = document.getElementById("allowLiving");
const countInput = document.getElementById("countInput");
const output = document.getElementById("output");
const copyAllButton = document.getElementById("copyAll");

const THEMES = {
  "Event Dunia": [
    "Tahun Baru Global",
    "Earth Day",
    "Hari Bumi Laut",
    "International Design Day",
    "World Music Day",
    "World Photography Day",
    "World Environment Day",
    "International Literacy Day"
  ],
  "Musiman": [
    "Spring Bloom",
    "Summer Solstice",
    "Autumn Harvest",
    "Winter Cozy",
    "Rainy Season",
    "Golden Hour Season",
    "Holiday Lights Season"
  ],
  "Kalender US": [
    "Independence Day",
    "Thanksgiving",
    "Memorial Day",
    "Labor Day",
    "Halloween",
    "Veterans Day",
    "Martin Luther King Jr. Day",
    "Presidents Day"
  ],
  "Evergreen": [
    "Minimalist Studio",
    "Geometric Abstract",
    "Modern Luxury",
    "Nature-Inspired Textures",
    "Tech & Future",
    "Soft Pastel Aesthetic",
    "Monochrome",
    "Handcrafted Materials"
  ]
};

const STYLE_LIBRARY = {
  ultra: [
    "foto ultra realistis",
    "detail tekstur tajam",
    "pencahayaan sinematik",
    "depth of field halus",
    "dynamic range tinggi",
    "tone warna natural"
  ],
  art: [
    "ilustrasi artistik",
    "gaya lukisan kontemporer",
    "sapuan kuas kaya tekstur",
    "palet warna kurasi",
    "komposisi grafis modern",
    "nuansa art poster premium"
  ]
};

const BASE_DETAILS = [
  "komposisi mengikuti prinsip 1/3 fotografi",
  "subjek utama terletak di tengah (centered) dengan ruang negatif seimbang",
  "latar belakang bersih dengan gradien lembut dan lapisan tekstur",
  "pencahayaan utama lembut dari arah samping, ditambah fill light halus",
  "sudut kamera eye-level, framing simetris, dan detail permukaan terlihat jelas",
  "tidak menampilkan makhluk hidup kecuali diminta user"
];

const OBJECT_LIBRARY = [
  "ornamen dekoratif",
  "instalasi visual berbahan kaca dan metal",
  "elemen tipografi 3D",
  "objek kerajinan tangan",
  "susunan props geometris",
  "lembaran kain berlipit",
  "panel akrilik transparan",
  "hiasan lampu ambient"
];

const LIVING_HINTS = [
  "figur manusia siluet minimal",
  "tangan yang memegang objek",
  "jejak aktivitas manusia yang halus"
];

function populateCategories() {
  Object.keys(THEMES).forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

function populateThemes() {
  themeSelect.innerHTML = "";
  const selected = categorySelect.value;
  THEMES[selected].forEach((theme) => {
    const option = document.createElement("option");
    option.value = theme;
    option.textContent = theme;
    themeSelect.appendChild(option);
  });
}

function clampCount() {
  const count = Number.parseInt(countInput.value, 10);
  if (Number.isNaN(count) || count < 1) {
    countInput.value = 1;
  }
  if (count > 6) {
    countInput.value = 6;
  }
}

function buildPrompt({ category, theme, style, keywords, allowLivingLife }) {
  const styleDetails = STYLE_LIBRARY[style];
  const object = OBJECT_LIBRARY[Math.floor(Math.random() * OBJECT_LIBRARY.length)];
  const keywordText = keywords
    ? `menggabungkan kata kunci tambahan: ${keywords}, dibuat menyatu dengan tema.`
    : "tanpa kata kunci tambahan.";
  const livingText = allowLivingLife
    ? `Jika dibutuhkan, boleh ada ${LIVING_HINTS[Math.floor(Math.random() * LIVING_HINTS.length)]} namun tetap minimalis.`
    : "Pastikan tidak ada manusia, hewan, atau bentuk makhluk hidup lainnya.";

  const sentences = [
    `Tema utama: ${theme} (${category}).`,
    `Visual fokus pada ${object} yang mewakili event tersebut secara simbolik, dengan material premium dan bentuk modern.`,
    `Gaya visual adalah ${styleDetails.join(", ")}.`,
    "Gunakan 1/3 rule photography secara eksplisit dan pastikan subjek utama centered.",
    "Gunakan komposisi bersih, ruang negatif luas, dan layering yang terasa profesional.",
    keywordText,
    livingText,
    ...BASE_DETAILS,
    "Tambahkan highlight halus, shadow lembut, dan kesan kedalaman yang nyata.",
    "Output final harus terasa layak untuk kampanye global dan siap digunakan di Adobe Firefly atau AI image lainnya."
  ];

  let prompt = sentences.join(" ");
  const filler = [
    "Pertahankan konsistensi palet warna, hindari elemen yang bertabrakan, dan jaga keseimbangan visual.",
    "Detail kecil seperti tekstur material, pantulan cahaya, dan gradasi bayangan harus terlihat realistis.",
    "Gunakan kualitas render tinggi, fokus tajam pada subjek, dan latar yang tetap halus tanpa noise berlebihan."
  ];

  let fillerIndex = 0;
  while (prompt.length < 400) {
    prompt = `${prompt} ${filler[fillerIndex % filler.length]}`;
    fillerIndex += 1;
  }

  return prompt;
}

function renderPrompts(prompts) {
  output.innerHTML = "";
  prompts.forEach((prompt, index) => {
    const card = document.createElement("div");
    card.className = "prompt-card";

    const text = document.createElement("p");
    text.textContent = prompt;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `Salin Prompt ${index + 1}`;
    button.addEventListener("click", async () => {
      await navigator.clipboard.writeText(prompt);
      button.textContent = "Tersalin!";
      setTimeout(() => {
        button.textContent = `Salin Prompt ${index + 1}`;
      }, 1400);
    });

    card.appendChild(text);
    card.appendChild(button);
    output.appendChild(card);
  });
}

function handleSubmit(event) {
  event.preventDefault();
  clampCount();
  const count = Number.parseInt(countInput.value, 10);
  const prompts = Array.from({ length: count }, () =>
    buildPrompt({
      category: categorySelect.value,
      theme: themeSelect.value,
      style: styleSelect.value,
      keywords: keywordInput.value.trim(),
      allowLivingLife: allowLiving.checked
    })
  );
  renderPrompts(prompts);
}

copyAllButton.addEventListener("click", async () => {
  const text = Array.from(output.querySelectorAll("p"))
    .map((node) => node.textContent)
    .join("\n\n");
  if (!text) {
    return;
  }
  await navigator.clipboard.writeText(text);
  copyAllButton.textContent = "Semua tersalin!";
  setTimeout(() => {
    copyAllButton.textContent = "Salin Semua";
  }, 1400);
});

categorySelect.addEventListener("change", populateThemes);

populateCategories();
populateThemes();

document.getElementById("promptForm").addEventListener("submit", handleSubmit);

const fs = require('fs');
const path = require('path');

// Путь к папке с изображениями
const imagesDir = path.join(__dirname, '../public/papka');
// Путь к выходному JSON-файлу
const outputFile = path.join(__dirname, '../src/data/products.json');

// Категории (папки)
const categories = ['all', 'category1', 'category2', 'category3', 'category4', 'category5', 'category6', 'category7', 'category8'];

// Максимальная длина имени файла (в символах)
const MAX_FILENAME_LENGTH = 90;

// Функция для парсинга имени файла
function parseFileName(file) {
  const regex = /^item_(.+)-(\d+)грн\.(jpg|jpeg|png|gif)$/i;
  const match = file.match(regex);
  
  if (!match) {
    console.warn(`Файл ${file} не соответствует формату, пропускаем`);
    return null;
  }

  const [, composition, price, extension] = match;
  const imageAlt = `Товар ${composition.replace(/-/g, ' ')}`;
  
  return {
    composition,
    price: parseInt(price, 10),
    imageAlt,
    extension,
  };
}

// Функция для генерации списка товаров
function generateProducts() {
  const products = [];
  let idCounter = 1;

  categories.forEach(category => {
    const categoryPath = path.join(imagesDir, category);
    
    if (!fs.existsSync(categoryPath)) {
      console.warn(`Папка ${category} не найдена`);
      return;
    }

    try {
      const files = fs.readdirSync(categoryPath);
      if (files.length === 0) {
        console.warn(`Папка ${category} пуста`);
        return;
      }

      files.forEach(file => {
        // Проверяем длину имени файла
        if (file.length > MAX_FILENAME_LENGTH) {
          console.warn(`Файл ${file} пропущен: имя длиннее ${MAX_FILENAME_LENGTH} символов (${file.length} символов)`);
          return;
        }

        const parsed = parseFileName(file);
        if (parsed) {
          const imagePath = `/papka/${category}/${file}`;
          
          products.push({
            id: idCounter.toString(),
            image: imagePath,
            imageAlt: parsed.imageAlt,
            price: parsed.price,
            composition: parsed.composition.replace(/-/g, ', '),
            category,
            description: `Описание товара из категории ${category}`,
          });

          idCounter++;
        }
      });
    } catch (error) {
      console.error(`Ошибка при чтении папки ${category}:`, error.message);
    }
  });

  // Создаём папку src/data, если она не существует
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Сохраняем результат в products.json
  try {
    fs.writeFileSync(outputFile, JSON.stringify(products, null, 2));
    console.log(`Файл ${outputFile} успешно сгенерирован с ${products.length} товарами`);
  } catch (error) {
    console.error(`Ошибка при записи ${outputFile}:`, error.message);
  }
}

// Запускаем генерацию
generateProducts();
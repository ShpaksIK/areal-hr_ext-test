# Кадровый учет

Веб-приложение, с помощью которого специалист по кадрам может вести учет сотрудников в нескольких организациях.

## Технологический стек

### Операционная система

Ubuntu 24.04 LTS с установленным Docker

### Инструменты разработки

- Visual Studio Code с расширениями:
    - ESLint
    - Prettier
- База данных PostgreSQL (17)
- NodeJS (24)

### Backend
- NestJS (10)
- pg, node-pg-migrate, joi

### Frontend
- Vue (3.5)
- Quasar
- Vite

## Работа с Git

Настройка
```bash
git config --global user.name "Ваше имя"
git config --global user.name "Ваша почта"
```

Основные операции
```bash
# Клонирование репозитория
git clone <repository-url>

# Проверка статуса файлов
git status

# Добавление файлов
git add <file>
git add . # все файлы

# Коммит изменений
git commit -m "Описание изменений"

# Отправка в удаленный репозиторий
git push origin <branch>

# Получение изменений из удаленного репозитория
git pull origin <branch>

# Создание новой ветки и переход на нее
git checkout -b <new-branch>

# Переключиться на ветку
git checkout <branch>

# Слияние веток
git merge <branch>

# Удаление ветки
git branch -d <branch>

# Просмотр истории коммитов
git log
```

## Просмотр документации проекта

```bash
cd docs
npm run dev
```

## Запуск проекта

1. Клонируйте репозиторий
```bash
git clone https://github.com/ShpaksIK/areal-hr_ext-test.git
cd areal-hr_ext-test
```

2. Скопируйте .env файл и запустите Backend
```bash
cd api
cp .env.example .env
npm install
npm run dev
```

3. Запустите Frontend
```bash
cd app
npm install
npm run dev
```

## Разработка

### Backend

```bash
cd api
npm install
npm run start
```

### Frontend

```bash
cd app
npm install
npm run dev
```

## Миграция базы данных
1. Перейдите в директорию api: `cd api`
2. Создайте / примените / откатите миграцию
```bash
# Применить миграции
npm run migrate:up

# Откатить последнюю миграцию
npm run migrate:down

# Создать новую миграцию
npm run migrate:create <name>
```
# MrSimon File System

Файловый менеджер с backend на Fastify и frontend на React/Vite.

# MVP Plan — File Manager

## Инфраструктура

- Настроить Yandex Object Storage (S3 bucket)
- Поднять PostgreSQL
- Создать S3 access keys

---

## Backend (Node.js)

- Создать API на Fastify + TypeScript
- Подключить PostgreSQL
- Подключить S3 хранилище
- Реализовать CRUD файлов и папок
- Реализовать presigned upload/download URLs

---

## База данных

Использовать PostgreSQL как источник правды для структуры файлового менеджера.

Хранить:

- файлы
- папки
- иерархию
- метаданные
- storage keys

Сами бинарные файлы хранить в S3.

---

## Frontend

Реализовать минимальный интерфейс:

- список файлов
- навигация по папкам
- breadcrumbs
- загрузка файлов
- создание папок
- переименование
- удаление

---

## Цель MVP

Сделать базовый файловый менеджер с:

- S3 хранилищем
- PostgreSQL
- Node.js backend
- React frontend

Дальнейшее развитие:

- прикрепление файлов к заданиям
- AI-анализ PDF
- обработка медиа
- хранение учебных материалов

----------

Проект использует monorepo-структуру на базе `pnpm workspaces`.

---

# Стек

## Frontend

- React
- Vite
- TypeScript

## Backend

- Node.js
- Fastify
- TypeScript

## Общее

- pnpm workspaces
- ESLint (flat config)
- Prettier

---

# Структура проекта

```txt
mrsimon-file-system/
  apps/
    api/        # Fastify backend
    web/        # React/Vite frontend

  eslint.config.mjs
  tsconfig.base.json
  pnpm-workspace.yaml
  package.json
```

---


# Установка зависимостей

## Установка всех зависимостей

Из корня проекта:

```bash
pnpm install
```

---

# Установка пакетов

## Установка пакета только для backend

```bash
pnpm --filter api add package-name
```

---

## Установка пакета только для frontend

```bash
pnpm --filter web add package-name
```

---


# Запуск проекта

Из корня:

```bash
pnpm dev
```
```bash
pnpm dev:api
```
```bash
pnpm dev:web
```


# Сборка

```bash
pnpm build
```
```bash
pnpm --filter api build
```
```bash
pnpm --filter web build
```

# ESLint

Используется один общий ESLint-конфиг в корне проекта:

```txt
eslint.config.mjs
```

Особенности:

- flat config
- TypeScript ESLint
- unused imports cleanup
- import sorting
- prettier integration

---



# Backend TypeScript

Backend использует:

```txt
module: NodeNext
moduleResolution: NodeNext
```

Это означает:

- backend работает как ESM-приложение
- локальные импорты требуют `.js` расширения


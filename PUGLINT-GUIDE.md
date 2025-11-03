Запуск линтера PUG - `npm run lint:pug`

❗ Возможные ошибки

1. **Invalid attribute separator found**
Атрибуты должны быть разделены запятыми, например:
`img(src="img.png", alt="text")`

Ошибка, если забыли запятую или написали пробел вместо неё.

2. **Illegal space before closing bracket**
Перед закрывающей скобкой в списке атрибутов не должно быть пробелов.

Правильно: `(attr1="val1", attr2="val2")`

Неправильно: `(attr1="val1", attr2="val2" )`

3. **Disallow duplicate attributes**
Атрибуты с одинаковым именем в одном теге — запрещены.

Например: `<img src="a.jpg" src="b.jpg">` — ошибка.

4. **Require specific attributes**
Например, у тега <img> обязательно должны быть src и alt.

Если одного из них нет — линтер выдаст ошибку.

5. **Require lowercase tags**
Все теги должны быть в нижнем регистре, например, div, а не DIV.

6. **Disallow trailing spaces**
Запрещены пробелы в конце строк.

7. **Disallow multiple line breaks**
Запрещены подряд идущие пустые строки (более одной).

8. **Require space after code operator**
После операторов Pug, например =, должен быть пробел:
`p= someVar` — правильно,
`p=someVar` — ошибка.

9. **Disallow legacy mixin call**
Запрет вызова миксинов старым синтаксисом (без скобок).

10.**Disallow spaces inside attribute brackets**
Запрещены пробелы после открывающей и перед закрывающей скобкой атрибутов:
`( attr="value")` или `(attr="value" )` — ошибка.

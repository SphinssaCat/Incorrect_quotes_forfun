const { Octokit } = require("@octokit/rest");

exports.handler = async function (event) {
  // Токен берётся из переменной окружения Netlify — НЕ из кода
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Токен не настроен" }),
    };
  }

  const octokit = new Octokit({ auth: token });

  // Замените на свои данные: владелец, репозиторий, путь к файлу
  const owner = "SphinssaCat";
  const repo = "Incorrect_quotes_forfun";
  const path = "quotes.json";

  try {
    // Читаем файл quotes.json из репозитория
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });

    // Содержимое приходит в base64 — декодируем
    const content = Buffer.from(response.data.content, "base64").toString("utf8");

    return {
      statusCode: 200,
      body: content, // отдаём как есть — это уже JSON
    };
  } catch (error) {
    return {
      statusCode: error.status || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

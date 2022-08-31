const respond = (response, status = 200) =>
  new Response(JSON.stringify(response), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Content-Encoding": "identity",
    },
  });

module.exports = {
  data: {
    name: "invite",
    description: "Пригласить бота на сервер",
  },
  enabled: true,
  execute: function ({}) {
    return respond({
      type: 4,
      data: {
        flags: 64,
        content: "ℹ️ Выберите одну из кнопок ниже:",
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 5,
                label: "Пригласить бота на сервер",
                url: `https://discord.com/api/oauth2/authorize?client_id=${client_id}&permissions=265216&scope=bot%20applications.commands`,
              },
              {
                type: 2,
                style: 5,
                label: "Добавить сервер на сайт",
                url: `https://boticord.top/add/server`,
              },
            ],
          },
        ],
      },
    });
  },
};

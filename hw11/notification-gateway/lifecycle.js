export function simulateMessagePipeline(messageText) {
  // 1. [1 - Sync] Синхронний код (Call Stack)
  console.log(`[1 - Sync] Отримано повідомлення від користувача: "${messageText}"`)

  // 5. [5 - Macrotask] Макротаска (додається в чергу макротасок)
  setTimeout(() => {
    console.log('[5 - Macrotask] Відтворення звуку та відправка мережевого сигналу')
  }, 0)

  // 3. [3 - Microtask] Перша мікротаска
  Promise.resolve().then(() => {
    console.log(`[3 - Microtask] Валідація тексту: "${messageText}" — успішно`)

    // 4. [4 - Microtask] Вкладена мікротаска (виконається перед макротаскою)
    return Promise.resolve().then(() => {
      console.log('[4 - Microtask] Оновлення статусу індикатора: "sending"')
    })
  })

  // 2. [2 - Sync] Другий синхронний код
  console.log('[2 - Sync] Обробник події натискання завершено')
}

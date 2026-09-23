let entryForm = document.getElementById('entry-form')
let entryTitle = document.getElementById('entry-title')
let entryText = document.getElementById('entry-text')
let entries = document.getElementById('entries')
let themeTogle = document.getElementById('theme-toggle')
let title = document.getElementById('title')

entryForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const titleValue = entryTitle.value
  const textValue = entryText.value

  let div = document.createElement('div')
  div.classList.add('entry')

  let h6 = document.createElement('h6')
  let p = document.createElement('p')

  let editButton = document.createElement('button')
  let deletButton = document.createElement('button')

  h6.textContent = titleValue
  p.textContent = textValue
  editButton.textContent = 'Редагувати'
  deletButton.textContent = 'Видалити'

  div.append(h6, p, editButton, deletButton)
  entries.append(div)
  entryForm.reset()

  console.log('parentNode:')
  console.log(div.parentNode)

  console.log('firstChild:')
  console.log(div.firstChild)

  console.log('lastChild:')
  console.log(div.lastChild)

  console.log('nextElementSibling:')
  console.log(div.nextElementSibling)

  console.log('previousElementSibling:')
  console.log(div.previousElementSibling)

  deletButton.addEventListener('click', (event) => {
    let parent = event.target.parentElement
    parent.remove()
  })

  editButton.addEventListener('click', (event) => {
    if (editButton.textContent === 'Редагувати') {
      let parent = event.target.parentElement
      let h6 = parent.querySelector('h6')
      let p = parent.querySelector('p')

      let input = document.createElement('input')
      let textarea = document.createElement('textarea')

      input.value = h6.textContent
      textarea.value = p.textContent

      h6.replaceWith(input)
      p.replaceWith(textarea)

      editButton.textContent = 'Зберегти'
    } else {
      let parent = event.target.parentElement
      let input = parent.querySelector('input')
      let textarea = parent.querySelector('textarea')

      let h6 = document.createElement('h6')
      let p = document.createElement('p')

      h6.textContent = input.value
      p.textContent = textarea.value

      input.replaceWith(h6)
      textarea.replaceWith(p)

      editButton.textContent = 'Редагувати'
    }
  })

  div.style.transition = 'all 0.2s ease'

  div.addEventListener('mouseenter', () => {
    div.style.backgroundColor = '#f0f4f8'
    div.style.borderColor = '#bbb'
  })

  div.addEventListener('mouseleave', () => {
    div.style.backgroundColor = ''
    div.style.borderColor = ''
  })

  div.addEventListener('click', (event) => {
    if (event.target.tagName !== 'BUTTON') {
      div.style.transform = 'scale(1.02)'
      setTimeout(() => {
        div.style.transform = 'scale(1)'
      }, 150)
    }
  })
})

themeTogle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme')

  if (document.body.classList.contains('dark-theme')) {
    document.body.style.background = '#121212'
    title.style.color = 'white'
  } else {
    document.body.style.background = 'white'
  }
})

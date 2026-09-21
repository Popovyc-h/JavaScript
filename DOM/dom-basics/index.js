const additionalSections = [
  {
    sectionId: 'attributes',
    title: 'Атрибути та властивості вузлів',
    text: 'DOM-властивості та HTML-атрибути мають важливі відмінності.',
    quote: 'Використовуйте dataset для нестандартних атрибутів data-*',
    isImportant: true,
  },
  {
    sectionId: 'styling',
    title: 'Керування класами та стилями',
    text: 'Властивість classList надає зручні методи add, remove та toggle.',
    quote: null,
    isImportant: false,
  },
]

let title = document.getElementById('article-title')
let container = document.querySelector('.content')
let counter = document.querySelector('#stats-counter')
let sections = document.querySelectorAll('.content-section')

let text = document.querySelector('#article-info')
text.textContent = 'Категорія: JavaScript | Стан: Опубліковано'

function inspectSectionRelatives(sectionElement) {
  return {
    parent: sectionElement.parentElement,
    prev: sectionElement.previousElementSibling,
    next: sectionElement.nextElementSibling,
    firstChild: sectionElement.firstElementChild,
    lastChild: sectionElement.lastElementChild,
  }
}

function updateArticleStats() {
  let articleContent = document.getElementById('article-content')
  let contentSections = articleContent.children
  const sectionCount = contentSections.length
  let totalCharsCount = 0

  for (const section of contentSections) {
    totalCharsCount += section.textContent.length
  }

  let statsCounter = document.getElementById('stats-counter')
  statsCounter.textContent = `Статистика: Секцій: ${sectionCount} | Символів: ${totalCharsCount}`
}

function enhanceArticleLinks() {
  let article = document.getElementById('article-content')
  let links = article.querySelectorAll('a')

  for (const link of links) {
    const href = link.getAttribute('href')

    if (href.startsWith('http://') || href.startsWith('https://')) {
      link.setAttribute('target', '_blank')
      link.setAttribute('rel', 'noopener noreferrer')
      link.classList.add('external-link')
      const section = link.closest('section')
      if (section) {
        section.dataset.hasExternalLinks = 'true'
      }
    } else if (href.startsWith('/')) {
      link.classList.add('internal-link')
    }
  }
}

function styleImportantQuotes() {
  let quotes = document.querySelectorAll('blockquote')

  for (const quote of quotes) {
    if (quote.matches('[data-important="true"]')) {
      quote.classList.add('important')
      quote.style.borderLeft = '4px solid #ff9800'
      quote.style.paddingLeft = '16px'
      quote.style.fontStyle = 'italic'
    }
  }
}

function generateTableOfContents() {
  let tocList = document.getElementById('toc-list')
  tocList.innerHTML = ''

  let headlines = document.querySelectorAll('#article-content h2')

  for (const headline of headlines) {
    const section = headline.closest('section')
    const sectionCode = section.dataset.section
    const li = document.createElement('li')
    const a = document.createElement('a')

    section.id = sectionCode
    a.href = `#${section.id}`
    a.textContent = headline.textContent
    li.append(a)

    tocList.append(li)
  }
}

function createSectionElement(sectionData) {
  let section = document.createElement('section')
  section.classList.add('content-section')
  section.dataset.section = sectionData.section

  let h2 = document.createElement('h2')
  let p = document.createElement('p')

  h2.classList.add('section-title')
  p.classList.add('paragraph')

  h2.textContent = sectionData.title
  p.textContent = sectionData.paragraph

  section.append(h2, p)

  if (sectionData.quote) {
    let quote = document.createElement('blockquote')
    quote.classList.add('quote')
    quote.textContent = sectionData.quote

    if (sectionData.isImportant) {
      quote.dataset.important = 'true'
    }

    section.append(quote)
  }

  section.insertAdjacentHTML('afterbegin', '<span class="badge">Розділ</span>')

  return section
}

function appendSections(sectionsList) {
  let article = document.getElementById('article-content')

  for (const section of sectionsList) {
    article.append(createSectionElement(section))
  }

  generateTableOfContents()
  enhanceArticleLinks()
  styleImportantQuotes()
  updateArticleStats()
}

function removeSectionByCode(sectionCode) {
  const section = document.querySelector(`section[data-section="${sectionCode}"]`)

  if (section) {
    section.remove()
    generateTableOfContents()
    updateArticleStats()
  }
}

const introSection = document.querySelector('[data-section="intro"]')
console.log(inspectSectionRelatives(introSection))

updateArticleStats()

enhanceArticleLinks()
styleImportantQuotes()

const mdnLink = document.querySelector('a[href*="developer.mozilla.org"]')
console.log(mdnLink.getAttribute('target'))
console.log(mdnLink.classList.contains('external-link'))

generateTableOfContents()

appendSections(additionalSections)

removeSectionByCode('styling')

const articles = [
  { id: 1, title: 'Основи JavaScript', tags: ['js', 'frontend', 'beginner'] },
  { id: 2, title: 'Просунутий React', tags: ['react', 'frontend', 'advanced'] },
  { id: 3, title: 'Node.js для початківців', tags: ['nodejs', 'backend', 'beginner'] },
  { id: 4, title: 'CSS Grid Layout', tags: ['css', 'frontend', 'intermediate'] },
  { id: 5, title: 'Express.js API', tags: ['nodejs', 'backend', 'advanced'] },
  { id: 6, title: 'TypeScript в React', tags: ['typescript', 'react', 'frontend', 'intermediate'] },
]

const getAllTags = function (articles) {
  return new Set(articles.flatMap((article) => article.tags))
}

const getTagCount = function (articles) {
  let counts = {}

  articles.forEach((article) => {
    article.tags.forEach((tag) => {
      if (tag in counts) {
        counts[tag] = counts[tag] + 1
      } else {
        counts[tag] = 1
      }
    })
  })

  return counts
}

const getArticlesByTag = function (articles, tag) {
  return articles.filter((article) => article.tags.includes(tag))
}

const addTag = function (articles, articleId, tag) {
  return articles.map((article) => {
    if (article.id === articleId) {
      let set = new Set(article.tags)
      set.add(tag)
      return { ...article, tags: Array.from(set) }
    } else {
      return article
    }
  })
}

const getTagsWithArticles = function (articles) {
  return articles.reduce((acc, article) => {
    article.tags.forEach((tag) => {
      if (tag in acc) {
        acc[tag].push(article.title)
      } else {
        acc[tag] = [article.title]
      }
    })
    return acc
  }, {})
}

const createArticleRange = function (from, to) {
  return {
    [Symbol.iterator]() {
      let current = from
      return {
        next() {
          if (current <= to) {
            return { value: current++, done: false }
          } else {
            return { value: undefined, done: true }
          }
        },
      }
    },
  }
}

const generateArticleViews = function (articleCount) {
  return Array.from({ length: articleCount }, () => Math.floor(Math.random() * 10001))
}

console.log(getAllTags(articles))
console.log(getTagCount(articles))
console.log(getArticlesByTag(articles, 'react'))
console.log(addTag(articles, 1, 'javascript'))
console.log(addTag(articles, 1, 'js'))
console.log(getTagsWithArticles(articles))
const range = createArticleRange(1, 5)
for (let num of range) {
  console.log(num)
}
console.log(Array.from(range))
console.log(generateArticleViews(5))

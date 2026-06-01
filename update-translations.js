const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, 'messages')
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'))

const additions = {
  en: {
    Invoices: {
      draft: "Draft",
      sent: "Sent"
    }
  },
  ro: {
    Invoices: {
      draft: "Ciornă",
      sent: "Trimisă"
    }
  }
}

files.forEach(file => {
  const lang = file.replace('.json', '')
  const filePath = path.join(dir, file)
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  
  const updates = additions[lang] || additions.en

  if (!data.Invoices) data.Invoices = {}

  Object.assign(data.Invoices, updates.Invoices)

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  console.log('Updated', file)
})

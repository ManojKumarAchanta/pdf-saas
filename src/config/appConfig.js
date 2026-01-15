export const appConfig = {
  tools: [
    {
      id: 'merge',
      name: 'Merge PDFs',
      description: 'Combine multiple PDF files into one document'
    },
    {
      id: 'arrange',
      name: 'Arrange Pages',
      description: 'Reorder pages in your PDF document'
    }
  ],
  sidebar: {
    width: 256,
    collapsedWidth: 64
  },
  layout: {
    maxContentWidth: 1200,
    pagePadding: 16
  }
}

export const defaultTool = appConfig.tools[0].id


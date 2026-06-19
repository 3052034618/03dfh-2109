export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/companion/index',
    'pages/trips/index',
    'pages/profile/index',
    'pages/game-detail/index',
    'pages/card-detail/index',
    'pages/publish-card/index',
    'pages/checklist-detail/index',
    'pages/edit-profile/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#7C3AED',
    navigationBarTitleText: '剧搭子',
    navigationBarTextStyle: 'white',
    backgroundColor: '#FAF5FF'
  },
  tabBar: {
    color: '#9CA3AF',
    selectedColor: '#7C3AED',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/companion/index',
        text: '约伴'
      },
      {
        pagePath: 'pages/trips/index',
        text: '行程'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})

const style = {}
const sidebarWidth = 128;
const mainMargin = 32;

style.container = {
}

style.menu = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  width: sidebarWidth,
  paddingBottom: '1em',
  background: '#1B1C1D',
  overflowY: 'scroll',
}

style.main = {
  marginLeft: sidebarWidth + mainMargin,
  marginTop : mainMargin,
  marginRight: mainMargin,
  minWidth: parseInt(sidebarWidth, 10) + 300,
}

export default style
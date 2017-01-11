const style = {}
const sidebarWidth = 128;
const mainMargin = 20;

style.container = {
}

style.menu = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  width: sidebarWidth,
  paddingBottom: '1em',
  // match menu background
  // prevents a white background when items are filtered out by search
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
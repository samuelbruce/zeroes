
actions.deZero = {
  title: 'De-zero',
  execute: async function () {
  }
}

window._menuItems.editTags.action.submenu.push({
    action: actions.deZero,
    order: 200,
    grouporder: 10
});
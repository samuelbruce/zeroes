
actions.deZero = {
  title: 'De-zero',
  execute: async function () {
    const supportedFields = ['order']; //, 'discNo', 'episode', 'season'];
    var message = '';
    
    let tracklist = uitools.getSelectedTracklist();
    await tracklist.whenLoaded();
    
    for (let i = 0; i < supportedFields.length; i++) {
      let fieldID = supportedFields[i];
      let fieldDef = uitools.tracklistFieldDefs[fieldID];
      
      await listAsyncForEach(tracklist, async (track, next) => {
        let oldVal = fieldDef.getValue(track);
        let newVal = oldVal.replace(/^0+/, '');
        fieldDef.setValue(track, newVal, true);
        next();
      }, () => {
        /*
        uitools.toastMessage.show('test', {
          disableUndo: true
        });
        */
      });
    }
  
  }
}

actions.reZero = {
  title: 'Re-zero',
  execute: async function () {
    const supportedFields = ['order']; //, 'discNo', 'episode', 'season'];
    var message = '';
    
    function isNum(str) {
      if (typeof str != 'string') return false
      return !isNaN(str) && !isNaN(parseFloat(str)) 
    }

    function maxDigits(list) {
      let max = 0;
      for (let i = 0; i < list.length; i++) {
        let str = list[i];
        if (isNum(str)) {
          let d = str.length;
          if (d > max) {
            max = d;
          }
        }
      }
      return max;
    }
    
    let tracklist = uitools.getSelectedTracklist();
    await tracklist.whenLoaded();
    
    for (let i = 0; i < supportedFields.length; i++) {
      let digits = 1;
      let fieldID = supportedFields[i];
      let fieldDef = uitools.tracklistFieldDefs[fieldID];
      let fieldVals = [];
      
      listForEach(tracklist, (track) => {
        let val = fieldDef.getValue(track);
        fieldVals.push(val);
      }, () => {
        digits = maxDigits(fieldVals);
      });
      
      await listAsyncForEach(tracklist, async (track, next) => {
        let oldVal = fieldDef.getValue(track);
        let newVal = String(oldVal).padStart(digits, '0');
        fieldDef.setValue(track, newVal, true);
        next();
      }, () => {
      });
    }
  
  }
}

window._menuItems.editTags.action.submenu.push({
    action: actions.deZero,
    order: 200,
    grouporder: 10
});

window._menuItems.editTags.action.submenu.push({
    action: actions.reZero,
    order: 201,
    grouporder: 10
});


actions.zeroes = {
  title: 'Zeroes',
  order: 200,
  icon: 'zeroes',
  submenu: function (params) {
    return new Promise(function (resolve, reject) {
      let ar = [actions.deZero, actions.reZero, actions.anyZero];
      resolve(ar);
    });
  }
}

window._menuItems.editTags.action.submenu.push({
  action: actions.zeroes,
  order: 200,
  grouporder: 10
});

actions.deZero = {
  title: 'De-zero',
  icon: 'deZero',
  execute: async function () {
    const supportedFields = ['order', 'discNo', 'episode', 'season'];
    
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
      });
    }
  
  }
}

actions.reZero = {
  title: 'Re-zero',
  icon: 'reZero',
  execute: async function () {
    const supportedFields = ['order', 'discNo', 'episode', 'season'];
    
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

actions.anyZero = {
  title: 'Custom Zero',
  icon: 'anyZero',
  execute: async function () {
  var list = uitools.getSelectedTracklist();
  var dlg = uitools.openDialog('dlgAnyZero', {
      show: true,
      modal: true,
      title: _('Custom Zero'),
      tracks: list
  });
  dlg.closed = async function () {
      app.unlisten(dlg, 'closed', dlg.closed);
      if (dlg.modalResult !== 1)
          return;
      var holds = dlg.getValue('getHolds')();
      var itmRec;
      var items = {};
      var prevStr;

      function rdQS(UnquotedString) {
          return "'" + UnquotedString.replace(/'/g, "''") + "'";
      };

      for (let i in holds) {
        let itmRec = holds[i];
        let id = itmRec.id;
        let str = itmRec.str;
        let tag = itmRec.tag;
        if (!items[id]) {
            items[id] = itmRec.item
        }

        prevStr = itmRec.item[tag];
        itmRec.item[tag] = str;
      }

      var list = app.utils.createTracklist(true);
      for (var id in items) {
        list.add(items[id]);
      }

      list.commitAsync();
    };
    app.listen(dlg, 'closed', dlg.closed);
  }
}
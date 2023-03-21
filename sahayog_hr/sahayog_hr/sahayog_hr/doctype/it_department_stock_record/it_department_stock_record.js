/*frappe.ui.form.on('IT Department Stock Record', {
  item_name: function(frm) {
      // Get the value of the item name field
      var item_nam = frm.doc.item_nam;

      // If the item name field is not empty and contains the value "mouse"
      if (item_nam && item_nam.indexOf("mouse") !== -1) {
          // Get the child table row that corresponds to the "mouse" item
          var row = frappe.utils.filter_dict(frm.doc.CheckItem || [], {'item_code': 'mouse'})[0];

          // If a row was found for the "mouse" item
          if (row) {
              // Update the availability value for the "mouse" item in the child table
              frappe.model.set_value(row.doctype, row.name, 'available_stock', 20);
          }
      }
  }
});*/
/*frappe.ui.form.on('IT Department Stock Record', {
  item_nam: function(frm) {
      // Get the value of the item name field
      var item_nam = frm.doc.item_nam;

      // If the item name field is not empty and contains the value "mouse"
      if (item_nam && item_nam.indexOf("mouse") !== -1) {
          // Update the availability value for the "mouse" item in the child table
          frappe.call({
              method: 'frappe.client.set_value',
              args: {
                  doctype: 'Check item',
                  filters: [
                      ['parent', '=', frm.doc.name],
                      ['item_code', '=', 'mouse']
                  ],
                  fieldname: 'available_stock',
                  value: 20
              },
              callback: function(response) {
                  // Do nothing
              }
          });
      }
  }
});
*/
frappe.ui.form.on('IT Department Stock Record', {
  item_nam: function(frm) {
      // Get the value of the item name field
      var item_nam = frm.doc.item_nam;

      // If the item name field is not empty and contains the value "mouse"
      if (item_nam && item_nam.indexOf("mouse") !== -1) {
          // Set the availability value to 20
          frm.set_value('available_stock', 20);
      }
  }
});


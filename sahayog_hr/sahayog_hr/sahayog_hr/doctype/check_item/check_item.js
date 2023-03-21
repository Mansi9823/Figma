// Copyright (c) 2023, Talib Sheikh and contributors
// For license information, please see license.txt

frappe.ui.form.on('Check Item', {
	After_save : function(frm) {
		frm.refresh_field('IN_Stock_Records')
	
		// Get the quantity of the 'Mouse' item
		var item_name = 'Mouse';
		var quantity = 50;
		
		// Display the total quantity
		frappe.msgprint("Total quantity of " + item_name + ": " + quantity);
		}
		
	
});



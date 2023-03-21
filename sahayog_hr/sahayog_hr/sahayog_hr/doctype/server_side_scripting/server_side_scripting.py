# Copyright (c) 2023, Talib Sheikh and contributors
# For license information, please see license.txt

# import frappe
from pydoc import doc
import frappe
from frappe import _
from frappe.model.document import Document

class serversidescripting(Document):
        
	#frappe.get_doc(doctype,name)
	def validate(self):
		self.get_document()

def get_document(self):
         doc = frappe.get_doc('client side scripting', self.client_side_doc)
frappe.msgprint (_("The first name is {0} and  age is {1}").format(doc.first_name, doc.age))
	#def validate(self):
      #   for row in self.get("Family_member"):
        #  frappe.msgprint(
        #     "'{0}'the family member name is '{1}' and relation is '{2}'".formate(
          #   row.idx, row.relation, row.age))
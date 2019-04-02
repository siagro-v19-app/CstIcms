sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function(Controller, MessageBox) {
	"use strict";

	return Controller.extend("br.com.idxtecCstIcms.controller.CstIcms", {
		onInit: function(){
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		
		onRefresh: function(){
			var oModel = this.getOwnerComponent().getModel();
			oModel.refresh(true);
			this.getView().byId("tableCstIcms").clearSelection();
		},
		
		onIncluir: function(){
			var oDialog = this._criarDialog();
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getModel("view");
			
			oViewModel.setData({
				titulo: "Inserir CST - ICMS",
				codigoEdit: true,
				msgSalvar: "CST - ICMS inserido com sucesso!"
			});
			
			oDialog.unbindElement();
			oDialog.setEscapeHandler(function(oPromise){
				if(oModel.hasPendingChanges()){
					oModel.resetChanges();
				}
			});
			
			var oContext = oModel.createEntry("/CstIcmss", {
				properties: {
					"Codigo": "",
					"Descricao": ""
				}
			});
			
			oDialog.setBindingContext(oContext);
			oDialog.open();
		},
		
		onEditar: function(){
			var oDialog = this._criarDialog();
			var oTable = this.byId("tableCstIcms");
			var nIndex = oTable.getSelectedIndex();
			var oViewModel = this.getModel("view");
			
			oViewModel.setData({
				titulo: "Editar CST - ICMS",
				codigoEdit: false,
				msgSalvar: "CST - ICMS alterado com sucesso!"
			});
			
			if(nIndex === -1){
				MessageBox.warning("Selecione um CST-ICMS na tabela!");
				return;
			}
			
			var oContext = oTable.getContextByIndex(nIndex);
			
			oDialog.bindElement(oContext.sPath);
			oDialog.open();
		},
		
		onRemover: function(){
			var that = this;
			var oTable = this.byId("tableCstIcms");
			var nIndex = oTable.getSelectedIndex();
			
			if(nIndex === -1){
				MessageBox.warning("Selecione um CST-ICMS na tabela!");
				return;
			}
			
			MessageBox.confirm("Deseja remover esse CST-ICMS?", {
				onClose: function(sResposta){
					if(sResposta === "OK"){
						that._remover(oTable, nIndex);
						MessageBox.success("CST-ICMS removido com sucesso!");
					}
				} 
			});
		},
		
		onSaveDialog: function(){
			var oView = this.getView();
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getModel("view");
			
			if(this._checarCampos(this.getView()) === true){
				MessageBox.warning("Preencha todos os campos obrigatórios!");
				return;
			} else{
				oModel.submitChanges({
					success: function(){
						oModel.refresh(true);
						MessageBox.success(oViewModel.getData().msgSalvar);
						oView.byId("CstIcmsDialog").close();
						oView.byId("tableCstIcms").clearSelection();
					},
					error: function(oError){
						MessageBox.error(oError.responseText);
					}
				});
			}
		},
		
		onCloseDialog: function(){
			var oModel = this.getOwnerComponent().getModel();
			
			if(oModel.hasPendingChanges()){
				oModel.resetChanges();
			}
			
			this.byId("CstIcmsDialog").close();
		},
		
		_remover: function(oTable, nIndex){
			var oModel = this.getOwnerComponent().getModel();
			var oContext = oTable.getContextByIndex(nIndex);
			
			oModel.remove(oContext.sPath, {
				success: function(){
					oModel.refresh(true);
					oTable.clearSelection();
				},
				error: function(oError){
					MessageBox.error(oError.responseText);
				}
			});
		},
		
		_criarDialog: function(){
			var oView = this.getView();
			var oDialog = this.byId("CstIcmsDialog");
			
			if(!oDialog){
				oDialog = sap.ui.xmlfragment(oView.getId(), "br.com.idxtecCstIcms.view.CstIcmsDialog", this);
				oView.addDependent(oDialog); 
			}
			return oDialog;
		},
		
		_checarCampos: function(oView){
			if(oView.byId("codigo").getValue() === "" || oView.byId("descricao").getValue() === ""){
				return true;
			} else{
				return false; 
			}
		},
		
		getModel: function(sModel){
			return this.getOwnerComponent().getModel(sModel); 
		}
	});
});
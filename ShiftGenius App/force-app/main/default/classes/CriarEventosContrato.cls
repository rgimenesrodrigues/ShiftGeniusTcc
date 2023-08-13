public without sharing class CriarEventosContrato {
    public integer horaInicio{get;set;}
    public integer horaFim{get;set;}
    public Date dataInicio{get;set;}
    public Date datafim{get;set;}
    public Contrato__c contrato{get;set;}
    public CriarEventosContrato(ApexPages.StandardController stdController){
        stdController.addFields(new list<string>{'Name','Conta__r.Name','Valor_pago_por_plant_o__c','Valor_recebido_por_plant_o__c'});
        contrato = (Contrato__c)stdController.getRecord();

    }


    
public String toastMessage { get; set; }

public void showMessage() {
    toastMessage = 'This is a toast message from the Apex controller.';
}

public pageReference criarEventos(){

    list<Event> eventos = new list<event>();
    event plantao = new Event();
    
    

    for(date d=dataInicio; d <= dataFim; d=d.addDays(1)){
        for(integer hora=horaInicio; hora <= horaFim; hora++){
            plantao = new Event();
            plantao.StartDateTime = Datetime.newInstance(d.Year(), d.Month(), d.day(), hora, 0, 0);
            plantao.EndDateTime = Datetime.newInstance(d.Year(), d.Month(), d.day(), hora+1, 0, 0);
            plantao.Subject = 'Plantão';
            plantao.Description =  'Novo Plantão gerado pelo contrato -' + contrato.Name;
            plantao.WhatId = this.contrato.id;
            plantao.PlantaoLivre__c = true;
            plantao.Hospital2__c = contrato.conta__c;
            plantao.ValorMedico__c = contrato.Valor_pago_por_plant_o__c;
            plantao.ValorShiftMed__c = contrato.Valor_recebido_por_plant_o__c;
            plantao.Contrato__c = contrato.id; 
            eventos.add(plantao);
        }
        
    }
    insert eventos;
    PageReference recordPage = new PageReference('/' + contrato.Id);
    recordPage.setRedirect(true);
return recordPage;

}
}
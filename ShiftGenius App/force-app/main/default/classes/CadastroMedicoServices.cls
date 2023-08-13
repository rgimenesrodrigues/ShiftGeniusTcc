public with sharing class CadastroMedicoServices {

    public string subtitulo{get;set;}
    public Contact medico{get;set;}
    public CadastroMedicoServices(ApexPages.StandardController stdController) {
        String contactId = System.currentPageReference().getParameters().get('medicoId');
        list<Contact> listaMedico = [Select id,Firstname,LastName,Email,Phone,CRM__c,Especialidades__c from Contact where id = : contactId limit 1];
        if(listaMedico.isEmpty()){
            medico = new Contact();
            subtitulo = 'Novo médico';
        }
        else{
            medico = listaMedico[0];
            subtitulo = 'Confirmar/Editar dados cadastrados';
        }
    }
    public void save()
	{
		update medico;
		
	}
	
	public PageReference cancel()
	{
        return new PageReference('https://axyz4-dev-ed.develop.my.salesforce-sites.com/consultaPlantoes?medicoId=003Dn00000CpwOjIAJ');
	}
}
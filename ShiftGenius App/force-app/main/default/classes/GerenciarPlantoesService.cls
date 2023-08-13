public without sharing class GerenciarPlantoesService {

    @AuraEnabled
    public static List<Event> fetchAllEvents(){
        List<Event> eventList = new List<Event>();
        string queryString = 'Select nomeMedico__c, horaInicio__c,Hospital3__c,AccountId,ActivityDate,ActivityDateTime,Compareceu__c,Contrato__c,CreatedById,CreatedDate,Description,DurationInMinutes,EndDate,EndDateTime,EventSubtype,GroupEventType,Hospital2__c,Hospital__c,Id,IsAllDayEvent,IsArchived,IsChild,IsDeleted,IsGroupEvent,IsPrivate,IsRecurrence,IsRecurrence2,IsRecurrence2Exception,IsRecurrence2Exclusion,IsReminderSet,LastModifiedById,LastModifiedDate,Location,OwnerId,PlantaoLivre__c,Recurrence2PatternStartDate,Recurrence2PatternText,Recurrence2PatternTimeZone,Recurrence2PatternVersion,RecurrenceActivityId,RecurrenceDayOfMonth,RecurrenceDayOfWeekMask,RecurrenceEndDateOnly,RecurrenceInstance,RecurrenceInterval,RecurrenceMonthOfYear,RecurrenceStartDateTime,RecurrenceTimeZoneSidKey,RecurrenceType,ReminderDateTime,ServiceAppointmentId,ShowAs,StartDateTime,Subject,SystemModstamp,ValorMedico__c,ValorShiftMed__c,Valor_a_Receber__c,WhatId,WhoId From Event';
        switch on UserInfo.getProfileId() {
            when '00eDn000000JEdlIAG' {		//Médico - só vê os dele e os livres
               queryString+= ' Where OwnerId = \'' + Userinfo.getUserId() + '\' Or PlantaoLivre__c = true';
            }	
            When '00eDn000000JEe0IAG' {         	// Coordenador - vê todos da equipe dele
                map<id,user> usuarios = new map<id, user>([Select id From User Where ManagerId = : Userinfo.getUserId()]);
                set<id> usuariosabaixo = usuarios.keySet();
                queryString+= ' Where Ownerid in : usuariosabaixo Or PlantaoLivre__c = true';
            }
            
        }
        
        eventList = database.query(queryString);
        return eventList;
    }
    @AuraEnabled
    public static map<string,string> pegaInformacoesUsuario(){
        map<string,string> mapa = new map<string,string>();
        switch on UserInfo.getProfileId() {
            when '00eDn000000JEdlIAG' {		
               mapa.put('papel','médico');
            }	
            When '00eDn000000JEe0IAG' {         	// Coordenador - vê todos da equipe dele
                mapa.put('papel','coordenador');
            }
            When else{
                mapa.put('papel','shiftMed');
            }
        }    
            user usuario = [Select Name,Especialidades__c,Manager.Name,City From User Where id = : userinfo.getUserId() ];
            mapa.put('Nome',usuario.name);
            mapa.put('Especialidades',usuario.Especialidades__c);
            mapa.put('Cidade',usuario.City);
            mapa.put('Coordenador',usuario.Manager.name);
            mapa.put('IdUsuario',usuario.Manager.name);

        return mapa;
    }

    @AuraEnabled
    public static boolean  updateItemStatus(String itemId){
        boolean returnValue = true;
        event evento = new event();
        try{
            evento.id = itemId;
            evento.PlantaoLivre__c =  false;
            evento.OwnerId = UserInfo.getUserId();
        
        update evento;

        }
        catch(exception ex){
            system.debug(ex.getMessage());
            returnValue = false;
        }
        return returnValue;
    }
    
}
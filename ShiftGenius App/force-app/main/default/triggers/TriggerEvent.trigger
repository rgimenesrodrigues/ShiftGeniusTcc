trigger TriggerEvent on Event (before update) {
    // List to hold records that need to be updated
    List<Event> recordsToUpdate = new List<event>();
    
    for (Event record : Trigger.new) {
        // Check if the OwnerId has changed
        if (record.OwnerId != Trigger.oldMap.get(record.Id).OwnerId) {
            user usuario = [Select Name From user Where Id = : record.OwnerId ];

            record.NomeMedico__c = usuario.name; 
            
          
        }
    }
    
    
}

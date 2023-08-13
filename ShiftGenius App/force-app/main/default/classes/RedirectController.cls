public class RedirectController {

    public PageReference redirectToUrl() {
       
        String redirectUri = '';
        
        Auth0Parameters__c auth0Parameters = Auth0Parameters__c.getInstance();
        redirectUri = auth0Parameters.RedirectUri__c;
        system.debug('entrou na redirect');
         return new pageReference(redirectUri);
        }
}
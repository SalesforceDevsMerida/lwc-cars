public with sharing class CarController {
  @AuraEnabled
  public static SObject getCarDetails(Id recordId) {
    try {
      return [
        SELECT
          Id,
          Name,
          Picture_URL__c,
          Make__c,
          MSRP__c,
          Category__c,
          Fuel_Type__c,
          Number_of_Seats__c,
          Control__c
        FROM Car__c
        WHERE Id = :recordId
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<SObject> getCars(String filter){
    try {
      String query = 'SELECT Id, Name, Picture_URL__c, MSRP__c FROM Car__c';
      // WHERE Name LIKE 'FORD%'
      if(String.isNotBlank(filter)){
        query += ' '+filter;
      }
      System.debug(query);
      return Database.query(query);
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static void saveCarDetails(List<Object> values) {
    try {
      Car__c car = new Car__c();
      car.Id = (Id) values[0];
      car.Name = (String) values[1];
      car.Category__c = (String) values[2];
      car.Make__c = (String) values[3];
      car.MSRP__c = Decimal.valueOf((String) values[4]);
      upsert car;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
  //wrapper class
  public class Filters {
    @AuraEnabled
    public String searchKey { get; set; }
    @AuraEnabled
    public Decimal maxPrice { get; set; }
    @AuraEnabled
    public String[] categories { get; set; }
    @AuraEnabled
    public String[] makeType { get; set; }
  }
  @AuraEnabled(Cacheable=true)
  public static List<Car__c> getCars(Filters filters) {
    String key, whereClause = '';
    Decimal maxPrice;
    String[] categories, makeType, criteria = new List<String>{};
    if (filters != null) {
      maxPrice = filters.maxPrice;
      categories = filters.categories;
      makeType = filters.makeType;
      if (!String.isEmpty(filters.searchKey)) {
        key = '%' + filters.searchKey + '%';
        criteria.add('Name LIKE :key');
      }
      if (filters.maxPrice >= 0) {
        criteria.add('MSRP__c <= :maxPrice');
      }
      if (filters.categories != null) {
        criteria.add('Category__c IN :categories');
      }
      if (filters.makeType != null) {
        criteria.add('Make__c IN :makeType');
      }
      if (criteria.size() > 0) {
        whereClause = 'WHERE ' + String.join(criteria, ' AND ');
      }
    }
    String query =
      'SELECT Id, Name, MSRP__c, Description__c, Category__c, Picture_URL__c FROM Car__c ' +
      whereClause +
      ' WITH SECURITY_ENFORCED ORDER BY Name';
    return Database.query(query);
  }
}

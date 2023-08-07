const redisPubSubService = require('../services/redisPubSub.service');

class InventoryServiceTest {
  constructor() {
    // channel: purchase_event
    redisPubSubService.subscribe('purchase_event', (channel, message) => {
      InventoryServiceTest.updateInventory(channel, message);
    });
  }

  static updateInventory(channel, message) {
    console.log(`Channel ${channel} to update inventory ${message}`);
  }
}

module.exports = new InventoryServiceTest();

import {EntitySubscriberInterface, EventSubscriber, InsertEvent} from "typeorm"
import {Deal} from "../entity/Deal"

@EventSubscriber()
export class DealSubscriber implements EntitySubscriberInterface<Deal> {
    listenTo() {
        return Deal
    }

    afterInsert(event: InsertEvent<Deal>) {
        const deal = event.entity
        const type = deal.type.name.charAt(0).toUpperCase()
        const date = new Date()
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        const year_lastTwoDigits = year.toString().substr(-2)
        if(month < 10){
           deal.inner_id = type + '-' + '0' + month + year_lastTwoDigits + '-' + deal.id
        }else{
            deal.inner_id = type + '-' + month + year_lastTwoDigits + '-' + deal.id
        }
        deal.save()
    }
}
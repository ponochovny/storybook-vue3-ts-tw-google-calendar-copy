export type TEvent = {
	start: string
	end: string
	title?: string
	allDay?: boolean
	class?: 'new-data' | 'sequence'
	_eid?: string
	id: string
}

type TModifiedDate = {
	format: (format: string) => any
}

export interface IEventData {
	allDay: boolean
	class: string
	end: Date & TModifiedDate
	start: Date & TModifiedDate
	focused: boolean
	title: string
	_eid: string
	id: string
	segments: {
		[key: string]: {
			start: Date
			isFirstDay: boolean
			isLastDay: boolean
		}
	}
}

export type TEvent = {
	start: string
	end: string
	title?: string
	allDay?: boolean
	class?: 'new-data' | 'sequence'
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
	segments: {
		[key: string]: {
			start: Date
			isFirstDay: boolean
			isLastDay: boolean
		}
	}
}

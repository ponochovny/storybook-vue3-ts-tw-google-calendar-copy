import { action } from '@storybook/addon-actions'
import UiCalendar from './Calendar.vue'
import { TEvent } from './helper/types'
import { ref } from 'vue'
import { format } from 'date-fns'

const fillData = (
	data: ('single' | 'long new' | 'long' | 'single new')[][]
) => {
	let res: any[] = []

	data.forEach((el, i) => {
		const date = new Date(new Date().setDate(new Date().getDate() + 2 + i))
		el.forEach((_el, _i) => {
			const timeStart = _el.includes('long')
				? ''
				: format(new Date(new Date().setHours(1 + _i)), 'HH:mm')
			const timeEnd = _el.includes('long')
				? ''
				: format(new Date(new Date().setHours(1 + _i + 1)), 'HH:mm')
			res.push({
				start: format(date, `yyyy-MM-dd ${timeStart}`),
				end: format(
					_el.includes('long')
						? new Date(date).setDate(date.getDate() + 4)
						: date,
					`yyyy-MM-dd ${timeEnd}`
				),
				title: 'Some title',
				allDay: _el.includes('long'),
				class: _el.includes('new') ? 'new-data' : '',
				deletable: false,
				resizable: false,
				draggable: false,
			})
		})
	})

	return res
}

export default {
	title: 'Calendar Flow/Calendar',
	component: UiCalendar,
	methods: { action },
}

const Template = (args: any) => ({
	components: { UiCalendar },
	setup() {
		const events = ref(args.events)
		const updateTimezone = (timezoneId: string) => {
			action('updateTimezone')(timezoneId)
		}
		const newEvent = (data: TEvent) => {
			events.value.push(data)
			action('newEvent')(data)
		}
		const editEvent = (data: TEvent) => {
			const idx = events.value.findIndex((el) => el.id === data.id)
			if (idx < 0) return
			events.value[idx] = { ...data }
			action('editEvent')(data)
		}
		return { args, events, updateTimezone, newEvent, editEvent }
	},
	template:
		'<ui-calendar v-bind="args" :events="events" @updateTimezone="updateTimezone" @newEvent="newEvent" @editEvent="editEvent" />',
})

export const General: any = Template.bind({})
General.args = {
	disableViews: ['years', 'year', 'day'],
	events: [],
	updateTimezone: (data: any) => console.log('test', data),
	newEvent: (data: TEvent) => console.log('newEvent', data),
	editEvent: (data: TEvent) => console.log('editEvent', data),
}
export const Fullfilled: any = Template.bind({})
Fullfilled.args = {
	disableViews: ['years', 'year', 'day'],
	events: fillData([
		['single'],
		['long', 'single', 'single'],
		['single', 'single', 'single'],
	]),
	updateTimezone: (data: any) => console.log('test', data),
	newEvent: (data: TEvent) => console.log('newEvent', data),
	editEvent: (data: TEvent) => console.log('editEvent', data),
}
export const WithActiveEvents: any = Template.bind({})

WithActiveEvents.args = {
	disableViews: ['years', 'year', 'day'],
	events: fillData([
		['single'],
		['long new', 'single', 'single'],
		['single', 'single', 'single'],
		[],
		[],
		['single', 'single', 'single'],
		['single', 'single', 'single', 'single new'],
	]),
	updateTimezone: (data: any) => console.log('test', data),
	newEvent: (data: TEvent) => (this as any)?.events.push(data),
	editEvent: (data: TEvent) => console.log('editEvent', data),
}

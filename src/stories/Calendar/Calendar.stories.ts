import { action } from '@storybook/addon-actions'
import UiCalendar from './Calendar.vue'
import { TEvent } from './helper/types'
import { ref } from 'vue'

export default {
	title: 'Calendar Flow/Calendar',
	component: UiCalendar,
	methods: { action },
}

const Template = (args) => ({
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
		return { args, events, updateTimezone, newEvent }
	},
	template:
		'<ui-calendar v-bind="args" :events="events" @updateTimezone="updateTimezone" @newEvent="newEvent" />',
})

export const General = Template.bind({})
General.args = {
	disableViews: ['years', 'year', 'day'],
	events: [],
	updateTimezone: (data: any) => console.log('test', data),
	newEvent: (data: TEvent) => console.log(data),
}
export const Fullfilled = Template.bind({})
Fullfilled.args = {
	disableViews: ['years', 'year', 'day'],
	events: [
		{
			start: '2023-04-04 12:30',
			end: '2023-04-04 13:45',
			title: 'Some title',
		},
		{
			start: '2023-04-04 14:30',
			end: '2023-04-04 15:00',
			title: 'Some title',
		},
		{
			start: '2023-04-04 16:00',
			end: '2023-04-04 17:10',
			title: 'Some title',
		},
		{
			start: '2023-04-04 17:20',
			end: '2023-04-04 18:00',
			title: 'Some title',
		},
		//
		{
			start: '2023-04-05 12:30',
			end: '2023-04-05 13:45',
			title: 'Some title',
		},
		{
			start: '2023-04-05 14:30',
			end: '2023-04-05 15:00',
			title: 'Some title',
		},
		//
		{
			start: '2023-04-06 12:30',
			end: '2023-04-06 13:45',
			title: 'Some title',
		},
		{
			start: '2023-04-06 14:30',
			end: '2023-04-06 15:00',
			title: 'Some title',
		},
		{
			start: '2023-04-06 16:00',
			end: '2023-04-06 17:10',
			title: 'Some title',
		},
		//
		{
			start: '2023-04-07 12:30',
			end: '2023-04-07 13:45',
			title: 'Some title',
		},
		//
		{
			start: '2023-04-08',
			end: '2023-04-11',
			title: 'Some title',
			allDay: true,
		},
	],
	updateTimezone: (data: any) => console.log('test', data),
	newEvent: (data: TEvent) => console.log(data),
}
export const WithActiveEvents = Template.bind({})
WithActiveEvents.args = {
	disableViews: ['years', 'year', 'day'],
	events: [
		{
			start: '2023-04-04 12:30',
			end: '2023-04-04 13:45',
			title: 'Some title',
		},
		{
			start: '2023-04-04 14:30',
			end: '2023-04-04 15:00',
			title: 'Some title',
		},
		{
			start: '2023-04-04 16:00',
			end: '2023-04-04 17:10',
			title: 'Some title',
		},
		{
			start: '2023-04-04 17:20',
			end: '2023-04-04 18:00',
			title: 'Some title',
		},
		//
		{
			start: '2023-04-05 12:30',
			end: '2023-04-05 13:45',
			title: 'Some title',
			class: 'new-data',
		},
		{
			start: '2023-04-05 14:30',
			end: '2023-04-05 15:00',
			title: 'Some title',
		},
		//
		{
			start: '2023-04-06 12:30',
			end: '2023-04-06 13:45',
			title: 'Some title',
		},
		{
			start: '2023-04-06 14:30',
			end: '2023-04-06 15:00',
			title: 'Some title',
		},
		{
			start: '2023-04-06 16:00',
			end: '2023-04-06 17:10',
			title: 'Some title',
		},
		//
		{
			start: '2023-04-07 12:30',
			end: '2023-04-07 13:45',
			title: 'Some title',
			class: 'new-data',
		},
		//
		{
			start: '2023-04-08',
			end: '2023-04-11',
			title: 'Some title',
			allDay: true,
			class: 'new-data',
		},
	],
	updateTimezone: (data: any) => console.log('test', data),
	newEvent: (data: TEvent) => this.events.push(data),
}

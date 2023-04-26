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
			start: '2023-04-21 12:30',
			end: '2023-04-21 13:45',
			title: 'Some title',
			deletable: false,
			resizable: false,
			draggable: false,
		},
		{
			start: '2023-04-21 14:30',
			end: '2023-04-21 15:00',
			title: 'Some title',
			deletable: false,
			resizable: false,
			draggable: false,
		},
		{
			start: '2023-04-21 16:00',
			end: '2023-04-21 17:10',
			title: 'Some title',
			deletable: false,
			resizable: false,
			draggable: false,
		},
		{
			start: '2023-04-21 17:20',
			end: '2023-04-21 18:00',
			title: 'Some title',
			deletable: false,
			resizable: false,
			draggable: false,
		},
		//
		{
			start: '2023-04-18 12:30',
			end: '2023-04-18 13:45',
			title: 'Some title',
			deletable: false,
			resizable: false,
			draggable: false,
		},
		{
			start: '2023-04-18 14:30',
			end: '2023-04-18 15:00',
			title: 'Some title',
			deletable: false,
			resizable: false,
			draggable: false,
		},
		//
		{
			start: '2023-04-19 12:30',
			end: '2023-04-19 13:45',
			title: 'Some title',
			deletable: false,
			resizable: false,
			draggable: false,
		},
		{
			start: '2023-04-19 14:30',
			end: '2023-04-19 15:00',
			title: 'Some title',
			deletable: false,
			resizable: false,
			draggable: false,
		},
		{
			start: '2023-04-19 16:00',
			end: '2023-04-19 17:10',
			title: 'Some title',
			deletable: false,
			resizable: false,
			draggable: false,
		},
		//
		{
			start: '2023-04-20 12:30',
			end: '2023-04-20 13:45',
			title: 'Some title',
			deletable: false,
			resizable: false,
			draggable: false,
		},
		//
		{
			start: '2023-04-21',
			end: '2023-04-30',
			title: 'Some title',
			allDay: true,
			deletable: false,
			resizable: false,
			draggable: false,
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
			start: '2023-04-21 12:30',
			end: '2023-04-21 13:45',
			title: 'Some title',
			deletable: false,
			resizable: false,
			draggable: false,
		},
		{
			start: '2023-04-21 14:30',
			end: '2023-04-21 15:00',
			title: 'Some title',
			deletable: false,
			resizable: false,
			draggable: false,
		},
		{
			start: '2023-04-21 16:00',
			end: '2023-04-21 17:10',
			title: 'Some title',
			deletable: false,
			resizable: false,
			draggable: false,
		},
		{
			start: '2023-04-21 17:20',
			end: '2023-04-21 18:00',
			title: 'Some title',
			deletable: false,
			resizable: false,
			draggable: false,
		},
		//
		{
			start: '2023-04-18 12:30',
			end: '2023-04-18 13:45',
			title: 'Some title',
			class: 'new-data',
		},
		{
			start: '2023-04-18 14:30',
			end: '2023-04-18 15:00',
			title: 'Some title',
			deletable: false,
			resizable: false,
			draggable: false,
		},
		//
		{
			start: '2023-04-19 12:30',
			end: '2023-04-19 13:45',
			title: 'Some title',
			deletable: false,
			resizable: false,
			draggable: false,
		},
		{
			start: '2023-04-19 14:30',
			end: '2023-04-19 15:00',
			title: 'Some title',
			deletable: false,
			resizable: false,
			draggable: false,
		},
		{
			start: '2023-04-19 16:00',
			end: '2023-04-19 17:10',
			title: 'Some title',
			deletable: false,
			resizable: false,
			draggable: false,
		},
		//
		{
			start: '2023-04-20 12:30',
			end: '2023-04-20 13:45',
			title: 'Some title',
			class: 'new-data',
		},
		//
		{
			start: '2023-04-21',
			end: '2023-04-30',
			title: 'Some title',
			allDay: true,
			class: 'new-data',
		},
	],
	updateTimezone: (data: any) => console.log('test', data),
	newEvent: (data: TEvent) => this.events.push(data),
}

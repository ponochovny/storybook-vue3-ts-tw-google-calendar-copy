import { action } from '@storybook/addon-actions'
import CalendarTooltip from './CalendarTooltip.vue'

export default {
	title: 'Calendar Flow/CalendarTooltip',
	component: CalendarTooltip,
	methods: { action },
}

const Template = (args) => ({
	components: { CalendarTooltip },
	setup() {
		return { args }
	},
	template: '<CalendarTooltip v-bind="args" />',
})

export const General = Template.bind({})
General.args = {}

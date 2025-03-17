/* global document */

// import './options.css'

import OptionsPage from './OptionsPage.svelte'
import { mount } from 'svelte'

const app = mount(OptionsPage, {
    target: document.getElementById('app'),
})

export default app

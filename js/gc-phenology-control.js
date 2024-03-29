/*
 Vue.js Geocledian phenology component
 created: 2021-09-21, jsommer
 updated: 2021-10-10, jsommer
 version: 0.2
*/
"use strict";

//language strings
const gcPhenologyLocales = {
  "en": {
    "options": { "title": "Phenology options", "date_format_hint": "YYYY-MM-DD", },
    "phenology" : {
      "settings": "Phenology options",
      "startdate": "Start date",
      "enddate": "End date",
      "getPhenology": "Get phenology",
      "reset": "Reset"
    }
  },
  "de": {
    "options": { "title": "Phänologie", "date_format_hint": "JJJJ-MM-TT", },
    "phenology" : {
      "settings": "Phänologie Einstellungen",
      "startdate": "Anfangsdatum",
      "enddate": "Enddatum",
      "getPhenology": "Phänologie",
      "reset": "Zurücksetzen"
    }
  },
}

Vue.component('gc-phenology', {
  props: {
    gcWidgetId: {
      type: String,
      default: 'phenology1',
      required: true
    },
    gcLayout: {
      type: String,
      default: 'vertical' // or horizontal
    },
    gcAvailableOptions: {
      type: String,
      default: 'widgetTitle'
    },
    gcWidgetCollapsed: {
      type: Boolean,
      default: false // or false
    },
    gcLanguage: {
      type: String,
      default: 'en' // 'en' | 'de'
    },
    gcStartdate: {
      type: String,
      default: ''
    },
    gcEnddate: {
      type: String,
      default: ''
    }
  },
  template: `<div :id="this.gcWidgetId" class="">

                <!-- p :class="['gc-options-title', 'is-size-6', !gcWidgetCollapsed ? 'gc-is-primary' : 'gc-is-tertiary']" 
                  style="cursor: pointer; margin-bottom: 0.5em;"    
                  v-on:click="togglePhenology" 
                  v-show="availableOptions.includes('widgetTitle')"> {{ $t('options.title')}}
                  <i :class="[!gcWidgetCollapsed ? '': 'is-active', 'fas', 'fa-angle-down', 'fa-sm']"></i>
                </p -->

                <!-- phenology container -->
                <div :class="[!gcWidgetCollapsed ? '': 'is-hidden']" style="margin-bottom: 1em;">

                  <div style="margin-bottom: 0.5em;">
                    <p :class="['gc-options-title', 'is-size-6 ', phenologySettings ? 'gc-is-primary' : 'gc-is-tertiary']" 
                    v-on:click="phenologySettings =! phenologySettings" style="cursor: pointer; margin-bottom: 0.5em!important;">
                    {{ $t('options.title') }} 
                    <i :class="[phenologySettings ? '': 'is-active', 'fas', 'fa-angle-down', 'fa-sm']"></i>
                    </p>
                  </div>

                  <!-- pheno settings -->
                  <div :class="[phenologySettings ? '' : 'is-hidden', layoutCSSMap['alignment'][gcLayout]]">
                    <div :class="['field', 'gc-field-'+gcLayout]">
                      <label class="label is-grey is-small has-text-left"> {{ $t('phenology.startdate') }} </label>
                      <div class="control">
                        <input :id="'inpstartdate_' + gcWidgetId" type="text" class="input is-small" v-bind:placeholder="$t('options.date_format_hint')" v-model="startDate">
                      </div>
                    </div>
                    <div :class="['field', 'gc-field-'+gcLayout]">
                      <label class="label is-grey is-small has-text-left"> {{ $t('phenology.enddate') }} </label>
                      <div class="control">
                        <input :id="'inpenddate_' + gcWidgetId" type="text" class="input is-small" v-bind:placeholder="$t('options.date_format_hint')" v-model="endDate">
                      </div>
                    </div>

                  </div> <!-- pheno settings -->

                </div><!-- phenology container -->

                <!-- pheno buttons -->
                <div class="is-flex" style="">
                  <button class="button is-light is-orange gc-button-analytics" v-on:click="getPhenology()">
                    <span class="content"><i class="fas fa-seedling fa-sm"></i> {{ $t('phenology.getPhenology')}} </span>
                  </button>
                  <button class="button is-light is-orange" v-on:click="resetPhenology()" v-bind:title="$t('phenology.reset')">
                    <i class="fas fa-undo fa-sm"></i><span class="content"></span>
                  </button>
                </div><!-- pheno buttons -->

            </div><!-- gcWidgetId -->`,
  data: function () {
    console.debug("gc-phenology - data()");
    return {
        phenology: "",
        phenologySettings: false,
        startdateCalendar: undefined,
        enddateCalendar: undefined,
        layoutCSSMap: { "alignment": {"vertical": "is-inline-block", "horizontal": "is-flex" }}
    }
  },
  i18n: { 
    locale: this.currentLanguage,
    messages: gcPhenologyLocales
  },
  created: function () {
    console.debug("gc-phenology! - created()");
    this.changeLanguage();
  },
  /* when vue component is mounted (ready) on DOM node */
  mounted: function () {
    console.debug("gc-phenology! - mounted()");
    
    try {
      this.changeLanguage();
    } catch (ex) {}

    // init date pickers
    this.initDatePickers();

  },
  computed: {
    availableOptions: {
      get: function() {
        return (this.gcAvailableOptions.split(","));
      }
    },
    currentLanguage: {
      get: function() {
        // will always reflect prop's value 
        return this.gcLanguage;
      },
    },
    startDate: {
      get: function() {
        // will always reflect prop's value 
        return this.gcStartdate;
      },
      set: function(value) {
        this.$root.$emit("phStartdateChange", value);
      }
    },
    endDate: {
      get: function() {
        // will always reflect prop's value 
        return this.gcEnddate;
      },
      set: function(value) {
        this.$root.$emit("phEnddateChange", value);
      }
    },
  },
  watch: {
    currentLanguage(newValue, oldValue) {
      this.changeLanguage();
      // reinit date pickers for different language
      this.initDatePickers();
    },
  },
  methods: {  
    togglePhenology() {
      this.gcWidgetCollapsed = !this.gcWidgetCollapsed;
    },
    changeLanguage() {
      this.$i18n.locale = this.currentLanguage;
    },
    getPhenology() {
      this.$root.$emit('getPhenology');
    },
    resetPhenology() {
      this.$root.$emit('resetPhenology');
    },
    initDatePickers() {
      
      if (this.startdateCalendar) {
        this.startdateCalendar.destroy();
      }
      this.startdateCalendar = new bulmaCalendar( document.getElementById( 'inpstartdate_'+this.gcWidgetId ), {
        startDate: new Date(), // Date selected by default
        dateFormat: 'yyyy-mm-dd', // the date format `field` value
        lang: this.currentLanguage, // internationalization
        overlay: false,
        closeOnOverlayClick: true,
        closeOnSelect: true,
        align: "right",
        // callback functions
        onSelect: function (e) { 
                    // hack +1 day
                    var a = new Date(e.valueOf() + 1000*3600*24);
                    this.startDate = a.toISOString().split("T")[0]; //ISO String splits at T between date and time
                    }.bind(this),
      });
      if (this.enddateCalendar) {
        this.enddateCalendar.destroy();
      }
      this.enddateCalendar = new bulmaCalendar( document.getElementById( 'inpenddate_'+this.gcWidgetId ), {
        startDate: new Date(), // Date selected by default
        dateFormat: 'yyyy-mm-dd', // the date format `field` value
        lang: this.currentLanguage, // internationalization
        overlay: false,
        closeOnOverlayClick: true,
        closeOnSelect: true,
        align: "right",
        // callback functions
        onSelect: function (e) { 
                    // hack +1 day
                    var a = new Date(e.valueOf() + 1000*3600*24);
                    this.endDate = a.toISOString().split("T")[0]; //ISO String splits at T between date and time
                    }.bind(this),
      });
    }
  }
});

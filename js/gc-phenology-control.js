/*
 Vue.js Geocledian phenology component
 created: 2021-09-21, jsommer
 updated: 2021-09-21, jsommer
 version: 0.1
*/
"use strict";

//language strings
const gcPhenologyLocales = {
  "en": {
    "options": { "title": "Phenology" },
    "phenology" : {
      "settings": "Phenology options",
      "startdate": "Start date",
      "enddate": "End date",
      "getPhenology": "Get Phenology",
      "reset": "Reset"
    }
  },
  "de": {
    "options": { "title": "Phänologie" },
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

                <p :class="['gc-options-title', 'is-size-6', gcWidgetCollapsed ? 'is-grey' : 'is-orange']" 
                  style="cursor: pointer; margin-bottom: 0.5em;"    
                  v-on:click="togglePhenology" 
                  v-show="availableOptions.includes('widgetTitle')"> 
                  {{ $t('options.title')}}
                  <i :class="[!gcWidgetCollapsed ? '': 'is-active', 'fas', 'fa-angle-down', 'fa-sm']"></i>
                </p>

                <!-- phenology container -->
                <div :class="[!gcWidgetCollapsed ? '': 'is-hidden']" style="margin-bottom: 1em;">

                  <div style="margin-top: 0.5em; margin-bottom: 0.5em;">
                    <p :class="['is-6 ', !phenologySettings ? 'is-grey' : 'is-orange']" 
                    v-on:click="phenologySettings =! phenologySettings" style="cursor: pointer; margin-bottom: 0.5em!important;">
                    {{ $t('phenology.settings') }} 
                    <i :class="[phenologySettings ? '': 'is-active', 'fas', 'fa-angle-down', 'fa-sm']"></i>
                    </p>
                  </div>

                  <!-- pheno settings -->
                  <div :class="[phenologySettings ? '' : 'is-hidden', layoutCSSMap['alignment'][gcLayout]]">
                    <div :class="['field', 'gc-field-'+gcLayout]">
                      <label class="label is-grey is-small has-text-left"> {{ $t('phenology.startdate') }} </label>
                      <div class="control">
                        <input type="text" class="input is-small" v-bind:placeholder="$t('phenology.startdate')" v-model="startDate">
                      </div>
                    </div>
                    <div :class="['field', 'gc-field-'+gcLayout]">
                      <label class="label is-grey is-small has-text-left"> {{ $t('phenology.enddate') }} </label>
                      <div class="control">
                        <input type="text" class="input is-small" v-bind:placeholder="$t('phenology.enddate')" v-model="endDate">
                      </div>
                    </div>

                  </div> <!-- pheno settings -->
        
                  <!-- pheno buttons -->
                  <div class="is-flex" style="padding-top: 1em;">
                    <button class="button is-light is-orange gc-button-analytics" v-on:click="getPhenology()">
                      <span class="content"><i class="fas fa-seedling fa-sm"></i> {{ $t('phenology.getPhenology')}} </span>
                    </button>
                    <button class="button is-light is-orange" v-on:click="resetPhenology()" v-bind:title="$t('phenology.reset')">
                      <i class="fas fa-undo fa-sm"></i><span class="content"></span>
                    </button>
                  </div><!-- pheno buttons -->

                </div><!-- phenology container -->

            </div><!-- gcWidgetId -->`,
  data: function () {
    console.debug("gc-phenology - data()");
    return {
        phenology: "",
        phenologySettings: false,
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
    }
  }
});

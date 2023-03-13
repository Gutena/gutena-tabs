/**
 * External dependencies
 */
import { includes, merge, pickBy } from 'lodash';
import { boxShadowCss } from './utils/helpers';

export default function DynamicStyles( attributes ) {
	const {
        tabMinWidth,
        tabPadding,
        tabBorder,
        tabSpacing,
        tabAfterGap,
        tabBoxShadow,
        tabColors,
        tabTitleFontFamily,
		tabTitleFontSize, 
		tabTitleFontStyle,
		tabTitleFontWeight,
		tabTitleTextTransform,
        tabIconSpacing,
        tabContainerColors, 
		tabContainerBorder,
		tabContainerPadding,
		tabContainerBoxShadow,
    } = attributes

    const transformData = ( data, fallback = {} ) => {
        let output = {}
        merge( output, fallback, data )
        return `${output?.top} ${output?.right} ${output?.bottom} ${output?.left}`
    }
    
    const transformBorder = ( data, type, fallback = {} ) => {
        let output = {}
        merge( output, processBorder( fallback ), processBorder( data ) )

        let newvar = output[ type ]
        return `${newvar?.width} ${newvar?.style} ${newvar?.color}`
    }

    const processBorder = data => {
        if ( typeof data == 'object' && Object.keys( data ).length == 3 ) {
            return {
                top: data,
                right: data,
                bottom: data,
                left: data
            }
        }
        return data
    }

	const styleProps = pickBy( {
        '--gutena--tabs-tab-min-width': tabMinWidth,
        '--gutena--tabs-tab-spacing': tabSpacing,
        '--gutena--tabs-tab-after-gap': tabAfterGap,

        // Font settings
        '--gutena--tabs-tab-font-family': tabTitleFontFamily,
        '--gutena--tabs-tab-font-size': tabTitleFontSize,
        '--gutena--tabs-tab-font-style': tabTitleFontStyle,
        '--gutena--tabs-tab-font-weight': tabTitleFontWeight,
        '--gutena--tabs-tab-text-transfrom': tabTitleTextTransform,

        // Tab padding
        '--gutena--tabs-tab-padding': transformData( tabPadding?.desktop ),
        '--gutena--tabs-tab-padding-tablet': transformData( tabPadding?.tablet ),
        '--gutena--tabs-tab-padding-mobile': transformData( tabPadding?.mobile ),

        // Tab default box shadow
        '--gutena--tabs-tab-box-shadow': boxShadowCss( tabBoxShadow?.normal, false ),
        '--gutena--tabs-tab-hover-box-shadow': boxShadowCss( tabBoxShadow?.hover, false ),
        '--gutena--tabs-tab-active-box-shadow': boxShadowCss( tabBoxShadow?.active, false ),

        // Tab default border
        '--gutena--tabs-tab-border-top': transformBorder( tabBorder?.normal?.border, 'top' ),
        '--gutena--tabs-tab-border-right': transformBorder( tabBorder?.normal?.border, 'right' ),
        '--gutena--tabs-tab-border-bottom': transformBorder( tabBorder?.normal?.border, 'bottom' ),
        '--gutena--tabs-tab-border-left': transformBorder( tabBorder?.normal?.border, 'left' ),
        '--gutena--tabs-tab-border-radius': transformData( tabBorder?.normal?.radius ),

        // Tab hover border
        '--gutena--tabs-tab-hover-border-top': transformBorder( tabBorder?.hover?.border, 'top' ),
        '--gutena--tabs-tab-hover-border-right': transformBorder( tabBorder?.hover?.border, 'right' ),
        '--gutena--tabs-tab-hover-border-bottom': transformBorder( tabBorder?.hover?.border, 'bottom' ),
        '--gutena--tabs-tab-hover-border-left': transformBorder( tabBorder?.hover?.border, 'left' ),
        '--gutena--tabs-tab-hover-border-radius': transformData( tabBorder?.hover?.radius ),

        // Tab active border
        '--gutena--tabs-tab-active-border-top': transformBorder( tabBorder?.active?.border, 'top' ),
        '--gutena--tabs-tab-active-border-right': transformBorder( tabBorder?.active?.border, 'right' ),
        '--gutena--tabs-tab-active-border-bottom': transformBorder( tabBorder?.active?.border, 'bottom' ),
        '--gutena--tabs-tab-active-border-left': transformBorder( tabBorder?.active?.border, 'left' ),
        '--gutena--tabs-tab-active-border-radius': transformData( tabBorder?.active?.radius ),

        // Tab default colors
        '--gutena--tabs-tab-text-color': tabColors?.normal?.text,
        '--gutena--tabs-tab-background-color': tabColors?.normal?.background,
        '--gutena--tabs-tab-background-gradient-color': tabColors?.normal?.gradient,
        '--gutena--tabs-tab-icon-color': tabColors?.normal?.icon,

        // Tab hover colors
        '--gutena--tabs-tab-hover-text-color': tabColors?.hover?.text,
        '--gutena--tabs-tab-hover-background-color': tabColors?.hover?.background,
        '--gutena--tabs-tab-hover-background-gradient-color': tabColors?.hover?.gradient,
        '--gutena--tabs-tab-hover-icon-color': tabColors?.hover?.icon,

        // Tab active colors
        '--gutena--tabs-tab-active-text-color': tabColors?.active?.text,
        '--gutena--tabs-tab-active-background-color': tabColors?.active?.background,
        '--gutena--tabs-tab-active-background-gradient-color': tabColors?.active?.gradient,
        '--gutena--tabs-tab-active-icon-color': tabColors?.active?.icon,
        '--gutena--tabs-tab-icon-spacing': tabIconSpacing,

        // Container padding
        '--gutena--tabs-tab-container-padding': transformData( tabContainerPadding?.desktop ),
        '--gutena--tabs-tab-container-padding-tablet': transformData( tabContainerPadding?.tablet ),
        '--gutena--tabs-tab-container-padding-mobile': transformData( tabContainerPadding?.mobile ),

        // Container default box shadow
        '--gutena--tabs-tab-container-box-shadow': boxShadowCss( tabContainerBoxShadow?.normal, false ),
        '--gutena--tabs-tab-container-hover-box-shadow': boxShadowCss( tabContainerBoxShadow?.hover, false ),

        // Container default colors
        '--gutena--tabs-tab-container-text-color': tabContainerColors?.normal?.text,
        '--gutena--tabs-tab-container-background-color': tabContainerColors?.normal?.background,
        '--gutena--tabs-tab-container-background-gradient-color': tabContainerColors?.normal?.gradient,

        // Container hover colors
        '--gutena--tabs-tab-container-hover-text-color': tabContainerColors?.hover?.text,
        '--gutena--tabs-tab-container-hover-background-color': tabContainerColors?.hover?.background,
        '--gutena--tabs-tab-container-hover-background-gradient-color': tabContainerColors?.hover?.gradient,

        // Container default border
        '--gutena--tabs-tab-container-border-top': transformBorder( tabContainerBorder?.normal?.border, 'top' ),
        '--gutena--tabs-tab-container-border-right': transformBorder( tabContainerBorder?.normal?.border, 'right' ),
        '--gutena--tabs-tab-container-border-bottom': transformBorder( tabContainerBorder?.normal?.border, 'bottom' ),
        '--gutena--tabs-tab-container-border-left': transformBorder( tabContainerBorder?.normal?.border, 'left' ),
        '--gutena--tabs-tab-container-border-radius': transformData( tabContainerBorder?.normal?.radius ),

        // Container hover border
        '--gutena--tabs-tab-container-hover-border-top': transformBorder( tabContainerBorder?.hover?.border, 'top' ),
        '--gutena--tabs-tab-container-hover-border-right': transformBorder( tabContainerBorder?.hover?.border, 'right' ),
        '--gutena--tabs-tab-container-hover-border-bottom': transformBorder( tabContainerBorder?.hover?.border, 'bottom' ),
        '--gutena--tabs-tab-container-hover-border-left': transformBorder( tabContainerBorder?.hover?.border, 'left' ),
        '--gutena--tabs-tab-container-hover-border-radius': transformData( tabContainerBorder?.hover?.radius ),

        }, value => typeof value !== 'undefined' && '' !== value && 'NaN' !== value && 'none' !== value && ! includes( value, 'undefined' )
    )

	return styleProps
}
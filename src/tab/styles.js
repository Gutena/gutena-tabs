/**
 * External dependencies
 */
import { includes, merge, pickBy } from 'lodash';

export default function DynamicStyles( attributes ) {
	const {
        tabBorder
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

        }, value => typeof value !== 'undefined' && '' !== value && 'NaN' !== value && 'none' !== value && ! includes( value, 'undefined' )
    )

	return styleProps
}
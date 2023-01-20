/**
 * Border Group
 * output 
 * { normal: { border: {top,right,bottom,left}, radius:npx }, hover:{} }
 * OR
 * { normal: { border: {color: '#1a4548', style: 'solid', width: '50px'}, radius:npx }, hover:{} }
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element'
import { 
    PanelBody,
    __experimentalSpacer as Spacer,
    __experimentalBoxControl as BoxControl,
    __experimentalBorderBoxControl as BorderBoxControl,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import colorSettingsData from './colorSettingsData';
import { gkIsEmpty, getGlobalColorVar } from '../utils/helpers';
 
const DEFAULT_PROPS = {
    normal: __( 'Normal', 'gutena-tabs' ),
    //hover: __( 'Hover', 'gutena-tabs' )
}

const noop = () => {};

const BorderGroup = ( {
    panelLabel = __( 'Border', 'gutena-tabs' ),
    attrValue = {},
    attrProps = DEFAULT_PROPS,
    onChangeFunc = noop,
    withPanel = true,
    borderRadius = true,
    colorVar = false
} ) => {
    const propsData = Object.keys( attrProps );
    const [ activeTab, setActiveTab ] = useState( propsData[0] );
    const colorGradientSettings = colorSettingsData();
    const { colors } = colorGradientSettings;

    const transformBorder = data => {
        if ( typeof data == 'object' && Object.keys( data ).length == 3 ) {
            data.style = data?.style && data?.style !== 'undefined' ? data?.style : 'solid'
        }
        return data
    }

    //Set attribute
    const setAttr = ( value , attrName ) => {
        let newAttr = attrValue;
        if( gkIsEmpty( newAttr[ activeTab ] ) ) {
            newAttr[ activeTab ] = {};
        }

        //get global color var name
        if ( colorVar && 'border' === attrName ) {
            if ( ! gkIsEmpty( value?.color ) ) {
                value.color = getGlobalColorVar( colorGradientSettings, value.color );
            } else {
                [ 'top', 'right', 'bottom', 'left' ].forEach( ( position ) => {
                    if ( ! gkIsEmpty( value?.[ position ]?.color ) ) {
                        value[ position ]['color'] = getGlobalColorVar( colorGradientSettings, value[ position ]['color'] );
                    }
                } );
            }
        }

        newAttr[ activeTab ][ attrName ] = transformBorder( value );
        
        onChangeFunc( { ...newAttr } );
    };

    const controls = (
        <>
            { propsData.length > 1 && /* show only if there is multiple items present. */
                <ToggleGroupControl 
                    label={ ! withPanel ? panelLabel : false }
                    value={ activeTab } 
                    onChange={ ( value ) => setActiveTab( value ) } 
                    isBlock
                    hideLabelFromVision={ withPanel }
                >
                    {
                        propsData.map( ( value ) => (
                            <ToggleGroupControlOption key={ value } value={ value } label={ attrProps[ value ] } />
                        ) )
                    }
                </ToggleGroupControl>
            }
            <BorderBoxControl
                label={ __( "Border", "gutena-tabs" ) }
                onChange={ ( value ) => setAttr( value, 'border' ) }
                value={ attrValue[ activeTab ]?.border }
                colors={ colors }
                enableAlpha={ true }
                popoverOffset={ 40 }
                popoverPlacement="left-start"
                __experimentalHasMultipleOrigins={ true }
            />
            { borderRadius &&
                <Spacer marginTop={ 4 } marginBottom={ 0 }>
                    <BoxControl
                        label={ __( "Radius", "gutena-tabs" ) }
                        values={ attrValue[ activeTab ]?.radius }
                        onChange={ ( radius ) => setAttr( radius, 'radius' ) }
                    />
                </Spacer>
            }
        </>
    )

    if ( withPanel ) {
        return (
            <PanelBody title={ panelLabel } initialOpen={ false } >
                { controls }
            </PanelBody>
        );
    }

    return controls;
};

export default BorderGroup;
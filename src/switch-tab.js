import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { useSelect } from '@wordpress/data';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls, store as blockEditorStore } from '@wordpress/block-editor';
import { SelectControl, PanelBody } from '@wordpress/components';

const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {
        const { name, attributes, setAttributes, isSelected, clientId } = props;
         
        if ( 'core/button' === name ) {
            const { rootTabsBlockAttributes, rootTabsBlockClientId } = useSelect( ( select ) => {
                const { getBlockParentsByBlockName, getBlockAttributes } = select( blockEditorStore );
                const rootTabsBlockClientId = getBlockParentsByBlockName( clientId, 'gutena/tabs' );

                return {
                    rootTabsBlockAttributes: getBlockAttributes( rootTabsBlockClientId ),
                    rootTabsBlockClientId: rootTabsBlockClientId,
                };
            }, [ clientId ] );

            if ( rootTabsBlockClientId?.length ) {
                const { gutenaOpenTab } = attributes;

                return (
                    <>
                        <BlockEdit { ...props } />
                        <InspectorControls> 
                            <PanelBody title={ __( 'Open Tab', 'gutena-tabs' ) } initialOpen={ true }>
                                <SelectControl
                                    label={ __( 'Select Tab', 'gutena-tabs' ) }
                                    value={ gutenaOpenTab }
                                    onChange={ ( value ) => {
                                        setAttributes( { gutenaOpenTab: value } ) 
                                        setAttributes( { url: ( value !== 'none' ) ? '#gutenatab' + parseInt( value ) : undefined } ) 
                                    } }
                                >
                                    <option value="none">{ __( 'None', 'gutena-tabs' ) }</option>
                                    {
                                        Array.from( Array( rootTabsBlockAttributes?.tabCount ).keys() ).map( ( value ) => (
                                            <option value={ value + 1 } key={ value.toString() }>{ sprintf( __( 'Tab %d', 'gutena-tabs' ), value + 1 ) }</option>
                                        ) )
                                    }
                                </SelectControl>
                            </PanelBody>
                        </InspectorControls> 
                    </>
                )
            }
        }

        return <BlockEdit { ...props } />;
    }
}, 'withInspectorControl' );

addFilter(
    'editor.BlockEdit',
    'gutena-tabs/with-inspector-controls',
    withInspectorControls
);
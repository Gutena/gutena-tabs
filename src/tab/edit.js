/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { 
    InnerBlocks,
    useBlockProps, 
    InspectorControls,
    useInnerBlocksProps,
    store as blockEditorStore
} from '@wordpress/block-editor';

/**
 * External dependencies
 */
import classnames from 'classnames';
import IconControl from '../components/IconControl';

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const gutenaTabUniqueIds = [];

import './editor.scss';
// const BLOCK_TEMPLATE = [ 
//     [ 'core/paragraph', { content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.' } ]
// ];

export default function edit( props ) {
    const { attributes, setAttributes, clientId, isSelected } = props;
    const { uniqueId, tabId, tabTitle } = attributes;

    const { hasChildBlocks, rootClientId, rootBlock } = useSelect(
		( select ) => {
			const { getBlock, getBlockOrder, getBlockRootClientId } = select( blockEditorStore );
			const rootId = getBlockRootClientId( clientId );

			return {
				hasChildBlocks: getBlockOrder( clientId ).length > 0,
				rootClientId: rootId,
                rootBlock: getBlock( rootId )
			};
		},
		[ clientId ]
	);

    const { updateBlockAttributes } = useDispatch( blockEditorStore );
    const { titleTabs, tabIcon } = rootBlock?.attributes;

    const saveArrayUpdate = ( value, index ) => {
		const newItems = titleTabs.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );

		updateBlockAttributes( rootClientId, {
			titleTabs: newItems,
		} );
	}

    const tabIndexId = tabId - 1;

    useEffect( () => {
        if ( ! uniqueId || gutenaTabUniqueIds.includes( uniqueId ) ) {
			setAttributes( {
				uniqueId: clientId.substr( 2, 9 ),
			} );
			gutenaTabUniqueIds.push( clientId.substr( 2, 9 ) );
		} else {
			gutenaTabUniqueIds.push( uniqueId );
		}
    }, [] )

	const blockProps = useBlockProps( {
        className: classnames( 'gutena-tab-block', `gutena-tab-block-${ uniqueId }` ),
    } );

    const innerBlocksProps = useInnerBlocksProps( blockProps, {
        //template: BLOCK_TEMPLATE,
        __experimentalLayout: false,
        templateLock: false,
        templateInsertUpdatesSelection: true,
        renderAppender: hasChildBlocks ? undefined : InnerBlocks.ButtonBlockAppender
    } );

    return (
        <>
            {
                tabIcon && (
                    <InspectorControls>
                        <IconControl 
                            activeIcon={ titleTabs?.[ tabIndexId ]?.icon } 
                            value={ titleTabs?.[ tabIndexId ]?.icon } 
                            onChange={ ( value ) => saveArrayUpdate( { icon: value?.iconName }, tabIndexId ) }
                            onClear={ () => saveArrayUpdate( { icon: '' }, tabIndexId ) }
                            withPanel={ true }
                            initialOpen={ true }
                            panelTitle={ __( 'Icon Settings', 'gutena-tabs' ) }
                        />
                    </InspectorControls>
                )
            }
            <div { ...innerBlocksProps } />
        </>
    );
}
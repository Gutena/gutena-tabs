/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { useEffect, useState } from '@wordpress/element';
import { useSelect, useDispatch, withSelect, withDispatch } from '@wordpress/data';
import { createBlock, createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { 
	__experimentalSpacer as Spacer,
    __experimentalBoxControl as BoxControl,
    __experimentalBorderBoxControl as BorderBoxControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
	Icon,
    Modal,
	Button, 
	TabPanel,
	PanelBody, 
	RangeControl,
	ToggleControl,
    SelectControl,
	FontSizePicker,
	ToolbarGroup, 
	ToolbarButton,
	ToolbarDropdownMenu
} from '@wordpress/components';
import { 
	__experimentalFontFamilyControl as FontFamilyControl,
	__experimentalFontAppearanceControl as FontAppearanceControl,
	__experimentalBlockVariationPicker as BlockVariationPicker,
    RichText,
	InspectorControls,
	BlockControls,
    useBlockProps, 
    useInnerBlocksProps,
    store as blockEditorStore,
	useSettings
} from '@wordpress/block-editor';
import { 
	chevronLeft, 
	chevronRight, 
	trash, 
	plus, 
	alignCenter, 
	alignJustify, 
	alignLeft, 
	alignRight 
} from '@wordpress/icons';
import {
	applyFilters,
} from '@wordpress/hooks';

/**
 * External dependencies
 */
import classnames from 'classnames';
import memoize from 'memize';
import { times, filter, isEqual } from 'lodash';

/**
 * Import custom components
 */
import BorderGroup from './components/BorderGroup';
import EventsControl from './components/EventsControl';
import RangeControlUnit from './components/RangeControlUnit';
import SelectDeviceDropdown from './components/SelectDeviceDropdown';

/**
 * Import custom
 */
import InserterModal from './inserters/inserter'
import parseIcon from './utils/parse-icon';
import { flattenIconsArray } from './utils/icon-functions';
import getIcons from './icons';
import DynamicStyles from './styles';

import variations from './variations'
import { gkIsEmpty } from './utils/helpers';
/**
 * Styles
 */
import './editor.scss';

/**
 * Returns the layouts configuration for a given number of panes.
 *
 * @param {number} panes Number of panes.
 *
 * @return {Object[]} Panes layout configuration.
 */
const getTabsTemplate = memoize( ( panes ) => {
	return times( panes, n => [ 'gutena/tab', { tabId: n + 1 } ] );
} );

const DEFAULT_PROPS = {
    normal: __( 'Normal', 'gutena-tabs' ),
    hover: __( 'Hover', 'gutena-tabs' ),
    active: __( 'Active', 'gutena-tabs' )
}

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const gutenaTabsUniqueIds = [];

function Placeholder( { clientId, attributes, setAttributes } ) {
    const defaultVariation = variations.filter( item => item.isDefault )[0] || variations[0];

    const { replaceInnerBlocks } = useDispatch( blockEditorStore );
    const blockProps = useBlockProps( {
        className: `gutena-tabs-block gutena-tabs-block-${ attributes.uniqueId }`,
    } );

    return (
        <div { ...blockProps }>
            <BlockVariationPicker
                label={ __( 'Tabs Style', 'gutena-tabs' ) }
                instructions={ __( 'Select a Tabs style to start with.', 'gutena-tabs' ) }
                variations={ variations }
                onSelect={ ( variation = defaultVariation ) => {
                    if ( variation.attributes ) {
                        setAttributes( variation.attributes );
                    }
                    if ( variation.innerBlocks ) {
                        replaceInnerBlocks(
                            clientId,
                            createBlocksFromInnerBlocksTemplate(
                                variation.innerBlocks
                            ),
                            true
                        );
                    }
                } }
                allowSkip
            />
        </div>
    );
}

function GutenaTabs( props ) {
    const { 
		attributes, 
		setAttributes, 
		clientId, 
		tabsBlock, 
		realTabsCount, 
		tabsInner, 
		resetOrder, 
		moveTab, 
		insertTab, 
		removeTab 
	} = props;
    const { 
		uniqueId, 
		tabCount, 
		activeTab, 
		titleTabs, 
		tabPosition, 
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
		tabIcon, 
		tabIconPosition, 
		tabIconSize, 
		tabIconSpacing, 
		tabContainerColors, 
		tabContainerBorder,
		tabContainerPadding,
		tabContainerBoxShadow,
		tabLayout,
		blockStyles, 
		layout 
	} = attributes;

	const { selectedBlock, selectedBlockClientId, parentBlockId, hasInnerBlocks, innerBlocksCount } = useSelect(
		( select ) => {
			const { getSelectedBlock, getSelectedBlockClientId, getBlockRootClientId, getBlocks, getBlockCount } = select( blockEditorStore );
			return {
				selectedBlock: getSelectedBlock(),
				selectedBlockClientId: getSelectedBlockClientId(),
				parentBlockId: getBlockRootClientId( getSelectedBlockClientId() ) ,
				hasInnerBlocks: getBlocks( clientId ).length > 0,
				innerBlocksCount: getBlockCount( clientId ),
			};
		},
		[ clientId ]
	);

	const [ isInserterOpen, setInserterOpen ] = useState( false );

	const [ currentTab, setCurrentTab ] = useState( activeTab );
	const [ isModalOpen, setModalOpen ] = useState( false );

	useEffect( () => {
		if ( clientId === parentBlockId ) {
			if ( selectedBlock?.attributes?.tabId ) {
				setCurrentTab( selectedBlock?.attributes?.tabId );
			}
		}
    }, [ selectedBlockClientId ] )

	useEffect( () => {
		if ( tabCount != innerBlocksCount ) {
			setAttributes( { tabCount: innerBlocksCount } );
		}
    }, [ innerBlocksCount ] )

	const saveArrayUpdate = ( value, index ) => {
		const newItems = titleTabs.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );

		setAttributes( {
			titleTabs: newItems,
		} );
	}

    const onMove = ( oldIndex, newIndex ) => {
		const newtitleTabs = [ ...titleTabs ];
		
        newtitleTabs.splice( newIndex, 1, titleTabs[ oldIndex ] );
		newtitleTabs.splice( oldIndex, 1, titleTabs[ newIndex ] );
		
        setAttributes( { titleTabs: newtitleTabs } );

		moveTab( oldIndex, newIndex );
		resetOrder();
		setCurrentTab( newIndex + 1 )
	}

	const onMoveForward = ( oldIndex ) => {
		return () => {
			if ( oldIndex === realTabsCount - 1 ) {
				return;
			}
			onMove( oldIndex, oldIndex + 1 );
		};
	}

	const onMoveBack = ( oldIndex ) => {
		return () => {
			if ( oldIndex === 0 ) {
				return;
			}
			onMove( oldIndex, oldIndex - 1 );
		};
	}

    useEffect( () => {
        if ( ! uniqueId || gutenaTabsUniqueIds.includes( uniqueId ) ) {
			setAttributes( {
				uniqueId: clientId.substr( 2, 9 ),
			} );
			gutenaTabsUniqueIds.push( clientId.substr( 2, 9 ) );
		} else {
			gutenaTabsUniqueIds.push( uniqueId );
		}
    }, [] )

	const iconsAll = flattenIconsArray( getIcons() );
    const iconsObj = iconsAll.reduce( ( acc, value ) => {
        acc[ value?.name ] = value?.icon
        return acc
    }, {} )

    const renderSVG = ( svg, size ) => {
        let renderedIcon = iconsObj?.[ svg ];
        // Icons provided by third-parties are generally strings.
        if ( typeof renderedIcon === 'string' ) {
            renderedIcon = parseIcon( renderedIcon );
        }

        return <Icon icon={ renderedIcon } size={ size } />;
    }

	const deviceType = useSelect( select => {
		return select( 'core/editor' ).getDeviceType();
    }, [] );

	const blockProps = useBlockProps( {
        className: classnames( 'gutena-tabs-block', `gutena-tabs-block-${ uniqueId }`, {
			[ `desktop-${ tabLayout?.desktop }` ]: 'horizontal' !== tabLayout?.desktop,
			[ `tablet-${ tabLayout?.tablet }` ]: 'default' !== tabLayout?.tablet,
			[ `mobile-${ tabLayout?.mobile }` ]: 'default' !== tabLayout?.mobile,
		} ),
    } );

    const innerBlocksProps = useInnerBlocksProps( {
        className: 'gutena-tabs-content'
    }, {
        template: getTabsTemplate( tabCount ),
		allowedBlocks: [ 'gutena/tab' ],
		templateLock: "all",
		renderAppender: false
    } );

	const getFontFamiliesList = ( fontFamilies ) => {
		if ( gkIsEmpty( fontFamilies ) ) {
			return {};
		}

		if ( ! Array.isArray( fontFamilies ) ) {
			const { theme, custom } = fontFamilies;
			fontFamilies = theme !== undefined ? theme : [];
			if ( custom !== undefined ) {
				fontFamilies = [ ...fontFamilies, ...custom ];
			}
		}

		if ( gkIsEmpty( fontFamilies ) || 0 == fontFamilies.length ) {
			return [];
		}

		return fontFamilies;
	}

	const [ 
		fontFamilies,
		fontSizes,
		fontStyle,
		fontWeight
	] = useSettings( 
		'typography.fontFamilies',
		'typography.fontSizes',
		'typography.fontStyle',
		'typography.fontWeight'
	);
	const fontFamiliesList = getFontFamiliesList( fontFamilies );

	const dynamicStyles = DynamicStyles( attributes )
    const renderCSS = (
		<style>
			{`
				.gutena-tabs-block-${ uniqueId } .gutena-tab-block:nth-of-type(${ currentTab }) {
					display: block !important;
				}

				.gutena-tabs-block-${ uniqueId } {
					${ Object.entries( dynamicStyles ).map( ( [ k, v ] ) => `${ k }:${ v }` ).join( ';' ) }
				}
			`}
		</style>
	);

	useEffect( () => {
        if ( ! isEqual( blockStyles, dynamicStyles ) ) {
			setAttributes( {
				blockStyles: dynamicStyles,
			} );
        }
    }, [ dynamicStyles ] )

	const tabHeadingOptions = (
		<>
			<PanelBody title={ __( 'Settings', 'gutena-tabs' ) } initialOpen={ false } className="gutena-tabs-settings">
				<ToggleGroupControl label={ __( 'Tabs Align', 'gutena-tabs' ) } value={ tabPosition } onChange={ ( value ) => setAttributes( { tabPosition: value } ) } isBlock>
					<ToggleGroupControlOption value="left" label={ __( 'Left', 'gutena-tabs' ) } />
					<ToggleGroupControlOption value="center" label={ __( 'Center', 'gutena-tabs' ) } />
					<ToggleGroupControlOption value="right" label={ __( 'Right', 'gutena-tabs' ) } />
					<ToggleGroupControlOption value="flex" label={ __( 'Fluid', 'gutena-tabs' ) } />
				</ToggleGroupControl>
				<Spacer marginTop={ 3 } marginBottom={ 0 } className="gutena-tabs-controls">
					<RangeControlUnit
						rangeLabel={ __( 'Tabs Min Width', 'gutena-tabs' ) }
						attrValue={ tabMinWidth }
						onChangeFunc={ ( value ) => setAttributes( { tabMinWidth: value } )  }
						rangeMin={ 0 }
						rangeMax={ {
							px: 800,
							em: 300,
							rem: 300,
						} }
						rangeStep={ 1 }
						attrUnits= { [ 'px', 'em', 'rem' ] }
					/>
					<RangeControlUnit
						rangeLabel={ __( 'Space between Tabs', 'gutena-tabs' ) }
						attrValue={ tabSpacing }
						onChangeFunc={ ( value ) => setAttributes( { tabSpacing: value } )  }
						rangeMin={ 0 }
						rangeMax={ {
							px: 100,
							em: 10,
							rem: 10,
						} }
						rangeStep={ 1 }
						attrUnits= { [ 'px', 'em', 'rem' ] }
					/>
					<RangeControlUnit
						rangeLabel={ __( 'Space after Tabs', 'gutena-tabs' ) }
						attrValue={ tabAfterGap }
						onChangeFunc={ ( value ) => setAttributes( { tabAfterGap: value } )  }
						rangeMin={ -1 }
						rangeMax={ {
							px: 100,
							em: 10,
							rem: 10,
						} }
						rangeStep={ 1 }
						attrUnits= { [ 'px', 'em', 'rem' ] }
					/>
					<BoxControl
						label={ <SelectDeviceDropdown sideLabel={ __( 'Padding', 'gutena-tabs' ) } labelAtLeft={ true } /> }
						values={ tabPadding?.[ deviceType.toLowerCase() ] }
						onChange={ ( value ) => {
							setAttributes( { 
								tabPadding: {
									...tabPadding,
									[ deviceType.toLowerCase() ]: value
								}
							} )
						} }
						sides={ tabPosition !== 'flex' ? [ 'top', 'right', 'bottom', 'left' ] : [ 'top', 'bottom' ] }
					/>
				</Spacer>
			</PanelBody>
			<PanelBody title={ __( 'Icon', 'gutena-tabs' ) } initialOpen={ false } className="gutena-tabs-settings">
				<ToggleControl
					label={ __( 'Enable Icon', 'gutena-tabs' ) }
					checked={ tabIcon }
					onChange={ () => setAttributes( { tabIcon: ! tabIcon } ) }
				/>
				{
					tabIcon && (
						<>
							<ToggleGroupControl label={ __( 'Position', 'gutena-tabs' ) } value={ tabIconPosition } onChange={ ( value ) => setAttributes( { tabIconPosition: value } ) } isBlock>
								<ToggleGroupControlOption value="left" label={ __( 'Left', 'gutena-tabs' ) } />
								<ToggleGroupControlOption value="top" label={ __( 'Top', 'gutena-tabs' ) } />
								<ToggleGroupControlOption value="right" label={ __( 'Right', 'gutena-tabs' ) } />
							</ToggleGroupControl>
							<RangeControl
								label={ __( 'Size (px)', 'gutena-tabs' ) }
								value={ tabIconSize }
								onChange={ ( value ) => setAttributes( { tabIconSize: value } ) }
								min={ 5 }
								max={ 100 }
							/>
							<RangeControl
								label={ __( 'Gap between Icon and Title (px)', 'gutena-tabs' ) }
								value={ tabIconSpacing }
								onChange={ ( value ) => setAttributes( { tabIconSpacing: value } ) }
								min={ 1 }
								max={ 100 }
							/>
						</>
					)
				}
			</PanelBody>
			<PanelBody title={ __( 'Typography', 'gutena-tabs' ) } initialOpen={ false } className="gutena-tabs-settings">
				<FontFamilyControl
					fontFamilies={ fontFamiliesList }
					value={ tabTitleFontFamily }
					onChange={ ( value ) => setAttributes( { tabTitleFontFamily: value } ) }
				/>
				<FontSizePicker
					value={ tabTitleFontSize }
					onChange={ ( value ) => setAttributes( { tabTitleFontSize: value } ) }
					fallBackFontSize={ 14 }
					fontSizes={ fontSizes }
				/>
				<FontAppearanceControl
					hasFontStyles={ !! fontStyle }
					hasFontWeights={ !! fontWeight }
					value={ {
						fontStyle: tabTitleFontStyle,
						fontWeight: tabTitleFontWeight,
					} }
					onChange={ ( styles ) => {
						setAttributes( {
							tabTitleFontStyle: styles?.fontStyle,
							tabTitleFontWeight: styles?.fontWeight
						} )
					} }
				/>
				<Spacer marginTop={ 6 } marginBottom={ 0 }>
					<SelectControl
						label={ __( 'Text transform', 'gutena-tabs' ) } 
						value={ tabTitleTextTransform }
						options={ [
							{ label: __( 'None', 'gutena-tabs' ), value: '' },
							{ label: __( 'Lower case', 'gutena-tabs' ), value: 'lowercase' },
							{ label: __( 'Upper case', 'gutena-tabs' ), value: 'uppercase' },
							{ label: __( 'Capitalized case', 'gutena-tabs' ), value: 'capitalize' },
						] }
						onChange={ ( value ) => setAttributes( { tabTitleTextTransform: value } ) }
					/>
				</Spacer>
			</PanelBody>
			<PanelBody title={ __( 'Color', 'gutena-tabs' ) } initialOpen={ false } className="gutena-tabs-settings">
				<EventsControl 
					componentName='ColorControl'
					label={ __( 'Colors', 'gutena-tabs' ) }
					attrValue ={ tabColors }
					onChangeFunc ={ ( value ) => setAttributes( { tabColors: value } ) }
					panelId={ clientId }
					linkColor={ false }
					iconColor={ tabIcon }
					withPanel={ false }
					eventTabs={ DEFAULT_PROPS }
				/>
			</PanelBody>
			<BorderGroup 
				panelLabel={ __( 'Border', 'gutena-tabs' ) }
				attrValue={ tabBorder }
				onChangeFunc = { ( value ) => setAttributes( { tabBorder: value } ) }
				colorVar={ true }
				attrProps={ DEFAULT_PROPS }
			/>
			<EventsControl 
				componentName='BoxShadowControl'
				label={ __( 'Box Shadow', 'gutena-tabs' ) }
				toggleLabel={ __( 'Enable Box Shadow', 'gutena-tabs' ) }
				attrValue ={ tabBoxShadow }
				onChangeFunc ={ ( value ) => setAttributes( { tabBoxShadow: value } ) }
				panelId={ clientId }
				eventTabs={ DEFAULT_PROPS }
			/>
			<PanelBody title={ __( 'Responsive Settings', 'gutena-tabs' ) } initialOpen={ false } className="gutena-tabs-settings">
				<ToggleGroupControl 
					label={ __( 'Tablet', 'gutena-tabs' ) } 
					value={ tabLayout?.tablet } 
					onChange={ ( value ) => {
						setAttributes( { tabLayout: {
							...tabLayout,
							tablet: value
						} } )
					} } 
					isBlock
				>
					<ToggleGroupControlOption value="default" label={ __( 'Inherit', 'gutena-tabs' ) } />
					<ToggleGroupControlOption value="scroll" label={ __( 'Swipe', 'gutena-tabs' ) } />
				</ToggleGroupControl>
				<ToggleGroupControl 
					label={ __( 'Mobile', 'gutena-tabs' ) } 
					value={ tabLayout?.mobile } 
					onChange={ ( value ) => {
						setAttributes( { tabLayout: {
							...tabLayout,
							mobile: value
						} } )
					} } 
					isBlock
				>
					<ToggleGroupControlOption value="default" label={ __( 'Inherit', 'gutena-tabs' ) } />
					<ToggleGroupControlOption value="scroll" label={ __( 'Swipe', 'gutena-tabs' ) } />
				</ToggleGroupControl>
			</PanelBody>
		</>
    )

	const tabContentOptions = (
		<>
			<PanelBody title={ __( 'Color', 'gutena-tabs' ) } initialOpen={ false } className="gutena-tabs-settings">
				<EventsControl 
					componentName='ColorControl'
					label={ __( 'Colors', 'gutena-tabs' ) }
					attrValue ={ tabContainerColors }
					onChangeFunc ={ ( value ) => setAttributes( { tabContainerColors: value } ) }
					panelId={ clientId }
					linkColor={ false }
					iconColor={ false }
					withPanel={ false }
				/>
			</PanelBody>
		 	<BorderGroup 
				panelLabel={ __( 'Border', 'gutena-tabs' ) }
				attrValue={ tabContainerBorder }
				onChangeFunc = { ( value ) => setAttributes( { tabContainerBorder: value } ) }
				colorVar={ true }
			/>
			<PanelBody title={ __( 'Padding', 'gutena-tabs' ) } initialOpen={ false } className="gutena-tabs-settings">
				<BoxControl
					label={ <SelectDeviceDropdown sideLabel={ __( 'Tabs Padding', 'gutena-tabs' ) } labelAtLeft={ true } /> }
					values={ tabContainerPadding?.[ deviceType.toLowerCase() ] }
					onChange={ ( value ) => {
						setAttributes( { 
							tabContainerPadding: {
								...tabContainerPadding,
								[ deviceType.toLowerCase() ]: value
							}
						} )
					} }
				/>
			</PanelBody>
			<EventsControl 
				componentName='BoxShadowControl'
				label={ __( 'Box Shadow', 'gutena-tabs' ) }
				toggleLabel={ __( 'Enable Box Shadow', 'gutena-tabs' ) }
				attrValue ={ tabContainerBoxShadow }
				onChangeFunc ={ ( value ) => setAttributes( { tabContainerBoxShadow: value } ) }
				panelId={ clientId }
			/>
		</>
	)

	const aligns = {
		left: {
			icon: alignLeft,
			title: __( 'Left', 'gutena-tabs' )
		},
		center: {
			icon: alignCenter,
			title: __( 'Center', 'gutena-tabs' )
		},
		right: {
			icon: alignRight,
			title: __( 'Right', 'gutena-tabs' )
		},
		flex: {
			icon: alignJustify,
			title: __( 'Fluid', 'gutena-tabs' )
		}
	}

	return (
		<>
			{ hasInnerBlocks && isModalOpen && (
				<Modal title={ __( 'Are you sure?', 'gutena-tabs' ) } isDismissible={ false } className="gutena-tabs-delete-tab-modal">
					<div>{ __( 'Do you really want to delete', 'gutena-tabs' ) } <strong>"{ titleTabs[ currentTab - 1 ]?.text }"</strong></div>
					<div style={ {  marginTop: '18px' } }>
						<Button variant="secondary" onClick={ () => { setModalOpen( false ) } } style={ { marginRight: '10px' } }>{ __( 'Cancel', 'gutena-tabs' ) }</Button>
						<Button variant="primary" onClick={ () => {
							const curTab = currentTab - 1;
							const currentItems = filter( titleTabs, ( item, i ) => curTab !== i );
							const newCount = tabCount - 1;
							removeTab( curTab );
							setAttributes( { titleTabs: currentItems, tabCount: newCount } );
							setCurrentTab( ( curTab === 0 ? 1 : curTab ) )
							resetOrder();
							setModalOpen( false );
						} }>{ __( 'Delete', 'gutena-tabs' ) }</Button>
					</div>
				</Modal>
			) }

			{ hasInnerBlocks && 
				<>
					<BlockControls group="block">
						<ToolbarDropdownMenu
							icon={ aligns?.[ tabPosition ]?.icon }
							label={ __( 'Tab Align', 'gutena-tabs' ) }
							controls={ Object.keys( aligns ).map( align => {
								{
									const isActive = align === tabPosition;
									return {
										icon: aligns?.[ align ]?.icon,
										label: aligns?.[ align ]?.title,
										title: sprintf(
											// translators: %s: Title
											__( 'Align %s', 'gutena-tabs' ),
											aligns?.[ align ]?.title
										),
										isActive,
										onClick: () => setAttributes( { tabPosition: align } ),
										role: 'menuitemradio',
									};
								}
							} ) }
						/>
					</BlockControls>
					<BlockControls>
						<ToolbarGroup>
							<ToolbarButton
								icon={ plus }
								label={ __( 'Add Tab', 'gutena-tabs' ) }
								onClick={ () => {
									const newBlock = createBlock( 'gutena/tab', { tabId: tabCount + 1 } );
									const newTabCount = tabCount + 1;
									insertTab( newBlock );

									const newtabs = titleTabs;
									newtabs.push( {
										text: sprintf( __( 'Tab %d', 'gutena-tabs' ), newTabCount ),
										icon: titleTabs[ 0 ].icon,
										iconPosition: 'left',
									} );
									setAttributes( { titleTabs: newtabs, tabCount: newTabCount } );
									setCurrentTab( newTabCount )
									saveArrayUpdate( { iconPosition: titleTabs[ 0 ].iconPosition }, 0 );
								} }
							/>
							{
								currentTab > 1 && (
									<ToolbarButton
										icon={ chevronLeft }
										label={ __( 'Move Tab Left', 'gutena-tabs' ) }
										onClick={ onMoveBack( currentTab - 1 ) }
									/>
								)
							}
							{
								realTabsCount !== currentTab && (
									<ToolbarButton
										icon={ chevronRight }
										label={ __( 'Move Tab Right', 'gutena-tabs' ) }
										onClick={ onMoveForward( currentTab - 1 ) }
									/>
								)
							}
							{
								realTabsCount > 1 && (
									<ToolbarButton
										icon={ trash }
										label={ __( 'Remove Tab', 'gutena-tabs' ) }
										onClick={ () => { setModalOpen( true ) } }
									/>
								)
							}
						</ToolbarGroup>
						{
							tabIcon && titleTabs[ currentTab - 1 ] && titleTabs[ currentTab - 1 ].icon && (
								<ToolbarGroup>
									<ToolbarButton
										icon={ renderSVG( titleTabs[ currentTab - 1 ].icon ) }
										label={ __( 'Edit Icon', 'gutena-tabs' ) }
										onClick={ () => setInserterOpen( true ) }
									/>
								</ToolbarGroup>
							)
						}
					</BlockControls>

					<InspectorControls>
						<TabPanel 
							className="gutena-tab-panel gutena-tabs"
							activeClass="active-tab"
							tabs={ [
								{
									name     : 'heading',
									title    : __( 'Tabs', 'gutena-tabs' ),
									className: 'gutena-default-tab',
								},
								{
									name     : 'content',
									title    : __( 'Container', 'gutena-tabs' ),
									className: 'gutena-active-tab',
								},
							] }>
							{ ( tab ) => {
									let tabout = tabHeadingOptions
									if ( tab?.name == 'content' )  {
										tabout = tabContentOptions
									}
									return tabout
								}
							}
						</TabPanel>
						
					</InspectorControls>

					<InserterModal
						isInserterOpen={ isInserterOpen }
						setInserterOpen={ setInserterOpen }
						value={ titleTabs[ currentTab - 1 ].icon }
						onChange={ ( value ) => {
							saveArrayUpdate( { icon: value?.iconName }, currentTab - 1 ) 
						} } 
					/>
				</>
			}

			{ hasInnerBlocks && renderCSS }

			{ hasInnerBlocks ? (
				<div { ...blockProps }>
					<ul className={ `gutena-tabs-tab tab-${ tabPosition } editor`}>
						{ times( tabCount, n => (
							<li className={ `gutena-tab-title ${ ( 1 + n === currentTab ? 'active' : 'inactive' ) }` } key={ n + 1 } data-tab={ n + 1 } onClick={ () => setCurrentTab( 1 + n ) }>
								<div className={ `gutena-tab-title-content icon-${ tabIconPosition }` }>
									{
										tabIcon && titleTabs[ n ] && titleTabs[ n ].icon && (
											<div className="gutena-tab-title-icon">
												{ renderSVG( titleTabs[ n ].icon, tabIconSize ) }
											</div>
										)
									}
									<div className="gutena-tab-title-text">
										<RichText
											tagName="div"
											placeholder={ __( 'Tab Title', 'gutena-tabs' ) }
											value={ ( titleTabs[ n ] && titleTabs[ n ].text ? titleTabs[ n ].text : '' ) }
											allowedFormats={ applyFilters( 'gutena_tabs.whitelist_richtext_formats', [ 'core/bold', 'core/italic', 'core/strikethrough', 'toolset/inline-field' ] ) }
											onChange={ value => {
												saveArrayUpdate( { text: value }, n );
											} }
										/>
									</div>
								</div>
							</li>
						) ) }
					</ul>
					<div { ...innerBlocksProps } />
				</div>
			) : (
				<Placeholder { ...props } />
			) }
		</>
	);
}

export default compose( [
	withSelect( ( select, ownProps ) => {
		const { clientId } = ownProps;
		const { getBlock, getBlockOrder } = select( 'core/block-editor' );
		const block = getBlock( clientId );

		return {
			tabsBlock: block,
			realTabsCount: block.innerBlocks.length,
			tabsInner: getBlockOrder( clientId ),
		};
	} ),
	withDispatch( ( dispatch, { clientId }, { select } ) => {
		const { getBlock, getBlocks } = select( 'core/block-editor' );
		const {
			moveBlockToPosition,
			updateBlockAttributes,
			insertBlock,
			replaceInnerBlocks,
		} = dispatch( 'core/block-editor' );

		const block = getBlock( clientId );
		const innerBlocks = getBlocks( clientId );
        
		return {
			resetOrder() {
				times( block.innerBlocks.length, n => {
					updateBlockAttributes( block.innerBlocks[ n ].clientId, {
						tabId: n + 1,
					} );
				} );
			},
			moveTab( tabId, newIndex ) {
				innerBlocks.splice( newIndex, 0, innerBlocks.splice( tabId, 1 )[0] );
				replaceInnerBlocks( clientId, innerBlocks );
			},
			insertTab( newBlock ) {
				insertBlock( newBlock, parseInt( block.innerBlocks.length ), clientId );
			},
			removeTab( tabId ) {
				innerBlocks.splice( tabId, 1 );
				replaceInnerBlocks( clientId, innerBlocks );
			},
		};
	} ),
] )( GutenaTabs );
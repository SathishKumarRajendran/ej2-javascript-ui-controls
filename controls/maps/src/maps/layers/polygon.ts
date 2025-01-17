import { Maps, PolygonSettingModel } from '../../index';
import { Coordinate, LayerSettings} from '../index';
import { PathOption, calculatePolygonPath, maintainSelection } from '../utils/helper';
/**
 * When injected, this module will be used to render polygon shapes over the Maps.
 */
export class Polygon {
    private maps: Maps;
    constructor(maps: Maps) {
        this.maps = maps;
    }
    /**
     * To render polygon for maps
     *
     * @param {Maps} maps - Specifies the layer instance to which the polygon is to be rendered.
     * @param {number} layerIndex -Specifies the index of current layer.
     * @param {number} factor - Specifies the current zoom factor of the Maps.
     * @returns {Element} - Returns the polygon element.
     * @private
     */
    public polygonRender(maps: Maps, layerIndex: number, factor: number): Element {
        const currentLayer: LayerSettings = <LayerSettings>maps.layersCollection[layerIndex as number];
        const polygonsSVGObject: Element = maps.renderer.createGroup({
            id: maps.element.id + '_LayerIndex_' + layerIndex + '_Polygons_Group'
        });
        currentLayer.polygonSettings.polygons.map((polygonSetting: PolygonSettingModel, polygonIndex: number) => {
            const polygonSVGObject: Element = maps.renderer.createGroup({
                id: maps.element.id + '_LayerIndex_' + layerIndex + '_Polygons_Group_' + polygonIndex
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const polygonData: Coordinate[] = polygonSetting.points;            
            const path: string = calculatePolygonPath(maps, factor, currentLayer, polygonData);
            const pathOptions: PathOption = new PathOption(
                maps.element.id + '_LayerIndex_' + layerIndex + '_PolygonIndex_' + polygonIndex,
                polygonSetting.fill, (polygonSetting.borderWidth / factor), polygonSetting.borderColor,
                polygonSetting.opacity, polygonSetting.borderOpacity, '', path);
            const polygonEle: Element = maps.renderer.drawPath(pathOptions) as SVGPathElement;
            maintainSelection(this.maps.selectedPolygonElementId, this.maps.polygonSelectionClass, polygonEle,
                                'PolygonselectionMapStyle');
            polygonSVGObject.appendChild(polygonEle);
            polygonsSVGObject.appendChild(polygonSVGObject);
        });
        return polygonsSVGObject;
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name
     */
    protected getModuleName(): string {
        return 'Polygon';
    }

    /**
     * To destroy the layers.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.maps = null;
    }
}

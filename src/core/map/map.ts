import { Graph } from "core/pathfinder";
import { AssetManager } from "core/asset-manager";
import { Camera } from "core/camera";

export interface ITileset {
  columns: number;
  firstgid: number;
  image: string;
  imageheight: number;
  imagewidth: number;
  margin: number;
  name: string;
  spacing: number;
  tilecount: number;
  tileheight: number;
  tilewidth: number;
  tiles: {
    id: number;
    properties: {
      name: string;
      type: string;
      value: any;
    }[];
  }[];
}

export interface ITilemapLayer {
  data: number[];
  height: number;
  id: number;
  name: string;
  opacity: number;
  type: string;
  visible: boolean;
  width: number;
  x: number;
  y: number;
}

export interface IState {
  height: number;
  width: number;
  version: number;
  infinite: boolean;
  layers: ITilemapLayer[];
  nextlayerid: number;
  nextobjectid: number;
  orientation: string;
  renderorder: string;
  tiledversion: string;
  tileheight: number;
  tilewidth: number;
  type: string;
  tilesets: ITileset[]
}

export interface IMapInitialState {
  tilemap: IState,
  graph?: {
    allowDiagonals: boolean;
  }
}

export class Map {
  public graph: Graph;
  public state: IState;
  
  constructor(props: IMapInitialState) {
    this.state = props.tilemap;
    this.graph = new Graph({
      width: props.tilemap.width,
      height: props.tilemap.height,
      map: props.tilemap.layers.filter(({ name }) => name === 'collision')[0].data,
      ...props.graph
    });
  }

  private renderLayer = (context: CanvasRenderingContext2D, tileset: ITileset, layer: ITilemapLayer, camera: Camera, image: HTMLImageElement) => {
    const { tileheight, tilewidth } = this.state;
    const { data: tiles } = layer;
    const { columns, spacing = 0 } = tileset;
    const { x: xOffset, y: yOffset, scale } = camera.state;
  
    if (!layer.visible) return void 0;
  
    for(let col = 0; col < layer.width; col++) {
      for(let row = 0; row < layer.height; row ++) {
        const tile = tiles[row * layer.width + col] - 1;
      
        if (tile <= 0) continue;
        context.drawImage(
          image,
          tilewidth * (tile - Math.floor(tile/columns) * columns) + (spacing * (tile - Math.floor(tile/columns) * columns)),
          tileheight * Math.floor(tile/columns) + spacing * Math.floor(tile/columns),
          tilewidth,
          tileheight,
          col * (tilewidth * scale) + Math.round(-xOffset * scale),
          row * (tileheight * scale) + Math.round(-yOffset * scale),
          ((tilewidth + 1) * scale),
          ((tileheight + 1) * scale),
        );
      }
    }
  }

  public render = (context: CanvasRenderingContext2D, assets: AssetManager, camera: Camera) => {
    const { tilesets: [tileset], layers } = this.state;
    const { image } = assets.getTileset(tileset.name);
    layers.forEach((layer) => {
      this.renderLayer(context, tileset, layer, camera, image);
    });
  }
}
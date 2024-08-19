import {STRIP_CHARS_IN_USER_INPUT} from "../../boot/constants";
import {Field} from "src/apps/models/Entity";



export class MasterData {

  public description: string = ''
  public schema: string = ''
  public items: object[] = []
  public fields: Field[] = []
  public apps: string[] = []
  public labelField: string | undefined = undefined
  public source: string | undefined
  public jsonPath: string | undefined

  constructor(
    public id: string,
    public name: string
  ) {
    this.name = name.replaceAll(STRIP_CHARS_IN_USER_INPUT, '')
  }

}

export default abstract class Bootable {
  abstract boot(): Promise<void>;
}

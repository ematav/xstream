import xs from '../../src/index';
import * as assert from 'assert';

describe('Stream.prototype.debug', () => {
  it('should allow inspecting the operator chain', (done) => {
    const expected = [0, 1, 2];
    const stream = xs.interval(50).take(3).debug(x => {
      assert.equal(x, expected.shift());
    });
    let listener = {
      next: (x: number) => {
        if (x === 2) {
          assert.equal(expected.length, 0);
          stream.removeListener(listener);
          done();
        }
      },
      error: done.fail,
      complete: done.fail,
    };
    stream.addListener(listener);
  });

  it('should propagate user mistakes in spy as errors', (done) => {
    const source = xs.interval(30).take(1);
    const stream = source.debug(
      x => <number> <any> (<string> <any> x).toLowerCase()
    );
    stream.addListener({
      next: () => done('next should not be called'),
      error: (err) => {
        assert.strictEqual(err.message, 'x.toLowerCase is not a function');
        done();
      },
      complete: () => {
        done('complete should not be called');
      },
    });
  });
});

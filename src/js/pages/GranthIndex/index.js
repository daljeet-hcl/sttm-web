import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import raagIndices from './raagIndices';
import { pageView } from '@/util/analytics';
import { toAngURL } from '@/util';

const sanitizeHash = (...args) => args.map(a => a.replace(/ /gi, '')).join('-');

export default class GranthIndex extends React.PureComponent {
  static propTypes = {
    location: PropTypes.shape({ hash: PropTypes.string }),
  };

  render() {
    return (
      <div className="row" id="content-root">
        <h4 className="breadcrumb">
          <Link to="/">Home</Link> » Index
        </h4>
        <div id="help">
          <div id="sidebar">
            <ul>
              {Object.entries(raagIndices).map(
                ([key, { name: granthName, indices }]) => (
                  <li key={key}>
                    <details>
                      <summary>{granthName}</summary>
                      <ul>
                        {indices.map(({ name }) => (
                          <li key={name}>
                            <a href={`#${sanitizeHash(granthName, name)}`}>
                              {name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                )
              )}
            </ul>
          </div>

          <main>
            {Object.entries(raagIndices).map(
              ([key, { name: granthName, source, indices }]) => (
                <React.Fragment key={key}>
                  <h3 id={granthName}> {granthName}</h3>
                  <table>
                    <thead>
                      <tr>
                        <th> Raag Name </th>
                        <th> Ang Range </th>
                      </tr>
                    </thead>
                    <tbody>
                      {indices.map(({ name, pages: [from, to], highlight }) => (
                        <tr id={`${sanitizeHash(granthName, name)}`} key={name}>
                          <td>{name}</td>
                          <td>
                            <Link
                              to={toAngURL({ ang: from, source, highlight })}
                            >
                              {from}
                            </Link>{' '}
                            to{' '}
                            <Link to={toAngURL({ ang: to, source })}>{to}</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </React.Fragment>
              )
            )}
          </main>
        </div>
      </div>
    );
  }

  scrollToHash = () => {
    const { hash } = this.props.location;
    if (hash.includes('#')) {
      const $item = document.querySelector(`[id="${hash.replace('#', '')}"]`);
      if ($item) {
        requestAnimationFrame(() => window.scrollTo(0, $item.offsetTop));
      }
    }
  };

  componentDidMount() {
    this.scrollToHash();
    pageView('/index');
  }
}
